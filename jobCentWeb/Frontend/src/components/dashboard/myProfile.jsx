import React from "react";

export const MyProfile = () => (
  <div className="edit-settings-top">
    <div className="edit-header-top">
      <div className="customer-profile-simple-top">
        <i className="customer-avatar-top">
          <div className="initial-placeholder-top">A</div>
          <div />
        </i>
        <h3 className="display-name-top">
          <span className="name-top">Alpha Tester</span>
        </h3>
      </div>
    </div>
    <div className="edit-panel">
      <div className="config-column">
        <h3 className="name-header">Display Name</h3>
        <div className="name-container">
         <div className="name-field">
         <div className="name-field-container">
              <input type="text" value="Alpha Tester"aria-label="Display Name" name="displayName" autocomplete="off" spellcheck="false" autocapitalize="off" id="display_name" class="name-text-field" placeholder="Display Name"/>
         </div>
         </div>
        </div>
      </div>
    </div>
  </div>
);
