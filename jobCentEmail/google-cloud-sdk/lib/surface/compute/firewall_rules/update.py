# -*- coding: utf-8 -*- #
# Copyright 2014 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Command for updating firewall rules."""

from __future__ import absolute_import
from __future__ import unicode_literals
from googlecloudsdk.api_lib.compute import base_classes
from googlecloudsdk.api_lib.compute import firewalls_utils
from googlecloudsdk.calliope import base
from googlecloudsdk.calliope import exceptions as calliope_exceptions
from googlecloudsdk.command_lib.compute.firewall_rules import flags


@base.ReleaseTracks(base.ReleaseTrack.GA)
class UpdateFirewall(base.UpdateCommand):
  """Update a firewall rule."""

  with_egress_firewall = True
  with_service_account = True
  with_disabled = False
  with_logging = False

  FIREWALL_RULE_ARG = None

  @classmethod
  def Args(cls, parser):
    cls.FIREWALL_RULE_ARG = flags.FirewallRuleArgument()
    cls.FIREWALL_RULE_ARG.AddArgument(parser, operation_type='update')
    firewalls_utils.AddCommonArgs(
        parser,
        for_update=True,
        with_egress_support=cls.with_egress_firewall,
        with_service_account=cls.with_service_account,
        with_disabled=cls.with_disabled)
    firewalls_utils.AddArgsForServiceAccount(parser, for_update=True)

  def ValidateArgument(self, messages, args):
    self.new_allowed = firewalls_utils.ParseRules(
        args.allow, messages, firewalls_utils.ActionType.ALLOW)

    args_unset = all(
        x is None
        for x in (args.allow, args.description, args.source_ranges,
                  args.source_tags, args.target_tags))
    if self.with_egress_firewall:
      args_unset = args_unset and all(
          x is None
          for x in (args.destination_ranges, args.priority, args.rules))
    if self.with_service_account:
      args_unset = args_unset and all(
          x is None
          for x in (args.source_service_accounts, args.target_service_accounts))
    if self.with_disabled:
      args_unset = args_unset and args.disabled is None
    if self.with_logging:
      args_unset = (args_unset and args.enable_logging is None)
    if args_unset:
      raise calliope_exceptions.ToolException(
          'At least one property must be modified.')

    if args.rules and args.allow:
      raise firewalls_utils.ArgumentValidationError(
          'Can NOT specify --rules and --allow in the same request.')

  def Run(self, args):
    """Issues requests necessary to update the Firewall rules."""
    holder = base_classes.ComputeApiHolder(self.ReleaseTrack())
    client = holder.client

    self.ValidateArgument(client.messages, args)
    # Set the resource reference which is used in composing resource-get
    # request.
    resource_reference = self.FIREWALL_RULE_ARG.ResolveAsResource(
        args, holder.resources)
    get_request = self._GetGetRequest(client, resource_reference)
    cleared_fields = []
    objects = client.MakeRequests([get_request])

    new_object = self.Modify(client, args, objects[0], cleared_fields)

    # If existing object is equal to the proposed object or if
    # Modify() returns None, then there is no work to be done, so we
    # print the resource and exit.
    if not new_object or objects[0] == new_object:
      return objects[0]

    with client.apitools_client.IncludeFields(cleared_fields):
      resource_list = client.MakeRequests(
          [self._GetSetRequest(client, resource_reference, new_object)])

    return resource_list

  def _GetGetRequest(self, client, resource_reference):
    """Returns the request for the existing Firewall resource."""
    return (client.apitools_client.firewalls, 'Get',
            client.messages.ComputeFirewallsGetRequest(
                firewall=resource_reference.Name(),
                project=resource_reference.project))

  def _GetSetRequest(self, client, resource_reference, replacement):
    request = client.messages.ComputeFirewallsPatchRequest(
        firewall=replacement.name,
        firewallResource=replacement,
        project=resource_reference.project)
    return (client.apitools_client.firewalls, 'Patch', request)

  def Modify(self, client, args, existing, cleared_fields):
    """Returns a modified Firewall message and included fields."""
    if args.allow:
      allowed = self.new_allowed
    elif args.allow is None:
      allowed = existing.allowed
    else:
      cleared_fields.append('allowed')
      allowed = []

    if args.description:
      description = args.description
    elif args.description is None:
      description = existing.description
    else:
      cleared_fields.append('description')
      description = None

    if args.source_ranges:
      source_ranges = args.source_ranges
    elif args.source_ranges is None:
      source_ranges = existing.sourceRanges
    else:
      cleared_fields.append('sourceRanges')
      source_ranges = []

    if args.source_tags:
      source_tags = args.source_tags
    elif args.source_tags is None:
      source_tags = existing.sourceTags
    else:
      cleared_fields.append('sourceTags')
      source_tags = []

    if args.target_tags:
      target_tags = args.target_tags
    elif args.target_tags is None:
      target_tags = existing.targetTags
    else:
      cleared_fields.append('targetTags')
      target_tags = []

    denied = []
    if args.rules:
      if existing.allowed:
        allowed = firewalls_utils.ParseRules(args.rules, client.messages,
                                             firewalls_utils.ActionType.ALLOW)
      else:
        denied = firewalls_utils.ParseRules(args.rules, client.messages,
                                            firewalls_utils.ActionType.DENY)
    elif args.rules is not None:
      if existing.allowed:
        cleared_fields.append('allowed')
        allowed = []
      else:
        cleared_fields.append('denied')
        denied = []

    direction = existing.direction

    if args.priority is None:
      priority = existing.priority
    else:
      priority = args.priority

    destination_ranges = []
    if args.destination_ranges:
      destination_ranges = args.destination_ranges
    elif args.destination_ranges is None:
      destination_ranges = existing.destinationRanges
    else:
      cleared_fields.append('destinationRanges')

    source_service_accounts = []
    if args.source_service_accounts:
      source_service_accounts = args.source_service_accounts
    elif args.source_service_accounts is None:
      source_service_accounts = existing.sourceServiceAccounts
    else:
      cleared_fields.append('sourceServiceAccounts')

    target_service_accounts = []
    if args.target_service_accounts:
      target_service_accounts = args.target_service_accounts
    elif args.target_service_accounts is None:
      target_service_accounts = existing.targetServiceAccounts
    else:
      cleared_fields.append('targetServiceAccounts')

    new_firewall = client.messages.Firewall(
        name=existing.name,
        direction=direction,
        priority=priority,
        allowed=allowed,
        denied=denied,
        description=description,
        network=existing.network,
        sourceRanges=source_ranges,
        sourceTags=source_tags,
        destinationRanges=destination_ranges,
        targetTags=target_tags,
        sourceServiceAccounts=source_service_accounts,
        targetServiceAccounts=target_service_accounts)
    return new_firewall


@base.ReleaseTracks(base.ReleaseTrack.BETA)
class BetaUpdateFirewall(UpdateFirewall):
  """Update a firewall rule."""

  with_disabled = True

  @classmethod
  def Args(cls, parser):
    cls.FIREWALL_RULE_ARG = flags.FirewallRuleArgument()
    cls.FIREWALL_RULE_ARG.AddArgument(parser, operation_type='update')
    firewalls_utils.AddCommonArgs(
        parser,
        for_update=True,
        with_egress_support=cls.with_egress_firewall,
        with_service_account=cls.with_service_account,
        with_disabled=cls.with_disabled)
    firewalls_utils.AddArgsForServiceAccount(parser, for_update=True)

  def Modify(self, client, args, existing, cleared_fields):
    new_firewall = super(BetaUpdateFirewall, self).Modify(
        client, args, existing, cleared_fields)

    if args.disabled is not None:
      new_firewall.disabled = args.disabled
    return new_firewall


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class AlphaUpdateFirewall(BetaUpdateFirewall):
  """Update a firewall rule."""

  with_logging = True

  @classmethod
  def Args(cls, parser):
    cls.FIREWALL_RULE_ARG = flags.FirewallRuleArgument()
    cls.FIREWALL_RULE_ARG.AddArgument(parser, operation_type='update')
    firewalls_utils.AddCommonArgs(
        parser,
        for_update=True,
        with_egress_support=cls.with_egress_firewall,
        with_service_account=cls.with_service_account,
        with_disabled=cls.with_disabled)
    firewalls_utils.AddArgsForServiceAccount(parser, for_update=True)
    flags.AddEnableLogging(parser, default=None)

  def Modify(self, client, args, existing, cleared_fields):
    new_firewall = super(AlphaUpdateFirewall, self).Modify(
        client, args, existing, cleared_fields)

    if args.enable_logging is None:
      new_firewall.enableLogging = existing.enableLogging
    else:
      new_firewall.enableLogging = args.enable_logging
    return new_firewall


UpdateFirewall.detailed_help = {
    'brief':
        'Update a firewall rule.',
    'DESCRIPTION':
        """\
        *{command}* is used to update firewall rules that allow/deny
        incoming/outgoing traffic. The firewall rule will only be updated for
        arguments that are specifically passed. Other attributes will remain
        unaffected. The `action` flag (whether to allow or deny matching
        traffic) cannot be defined when updating a firewall rule; use
        `gcloud compute firewall-rules delete` to remove the rule instead.
        """,
}
