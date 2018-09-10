const stellarSDK = require("stellar-sdk");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK();
const Transfer = require("../models").Transfer;
const User = require("../models").User;
module.exports = {
  create(req, res) {
    const from = req.body.from;
    const to = req.body.to;
    const amount = parseInt(req.body.amount);
    let fromUser;
    let toUser;
    let fromBalance;
    let data = {};
    User.findOne({ where: { email: from } })
      .then(user => {
        // find current balance through sdk using user.publicKey and assign that to fromBalance.
        fromUser = user;
        fromBalance = parseInt(user.jobCents);
        return User.findOne({ where: { email: to } });
      })
      .then(user => {
        toUser = user;
        if (fromBalance >= amount) {
          //   keyPair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
          //   new Promise(function(resolve, reject) {
          //     nCentSDKInstance.transferTokens(
          //       keyPair,
          //       toUser.publicKey,
          //       tokenType,
          //       amount,
          //       resolve,
          //       reject
          //     );
          //   })
          // .then(transfer => {
          // console.log(transfer);
          Transfer.create({
            from,
            to,
            amount
          })
            .then(transfer => {
              fromUser
                .update({
                  jobCents: fromBalance - amount
                })
                .then(fromuser => {
                  data.fromUser = fromuser;
                  toUser
                    .update({
                      jobCents: parseInt(toUser.jobCents) + amount
                    })
                    .then(touser => {
                      data.toUser = touser;
                      res.status(200).send(data);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                });
            })

            // })
            .catch(err => {
              console.log(err);
              res.status(400).send("error");
            });
        } else {
          res.status(400).send("not enough jobCents");
        }
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }
};
