const stellarSDK = require("stellar-sdk");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK();
const Transfer = require("../models").Transfer;
const User = require("../models").User;
const email = require("./email.js");
const awsEmail = require("./awsEmail.js");
module.exports = {
  create(req, res) {
    const from = req.body.from;
    const to = req.body.to;
    const amount = parseInt(req.body.amount);
    // const tokenType = "b3ef967c-e838-4690-9a71-a4edda107241";
    const tokenType = "d3c5add3-382e-4505-815b-72221c7f0c45";
    let fromUser;
    let toUser;
    let fromBalance;
    let data = {};
    User.findOne({ where: { email: from } })
      .then(user => {
        // find current balance through sdk using user.publicKey and assign that to fromBalance.
        fromUser = user;
        fromBalance = parseInt(user.jobCents);
        console.log(fromBalance);
        console.log(fromBalance > amount);

        return User.findOne({ where: { email: to } });
        // return User.findOne({ where: { id: to } });
      })
      .then(user => {
        toUser = user;
        if (!toUser) {
          User.create({
            email: to,
            jobCents: "0"
          })
            .then(user => {
              data.user = user;
              const wallet = nCentSDKInstance.createWalletAddress();
              data.privateKey = wallet.secret();
              data.publicKey = wallet.publicKey();
              return data;
            })
            .then(data => {
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              toUser = user;
              console.log(fromUser);
              console.log(toUser);

              if (fromBalance >= amount) {
                keyPair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
                new Promise(function(resolve, reject) {
                  nCentSDKInstance.transferTokens(
                    keyPair,
                    toUser.publicKey,
                    tokenType,
                    amount,
                    resolve,
                    reject
                  );
                })
                  .then(transfer => {
                    console.log(transfer.data);

                    data = transfer.data;
                    Transfer.create({
                      from,
                      to,
                      amount
                    }).then(transfer => {
                      console.log("data sender balance");

                      console.log(data.sender.balance);

                      fromUser
                        .update({
                          jobCents: data.sender.balance
                        })
                        .then(fromuser => {
                          data.fromUser = fromuser;
                          console.log("data receiver balance");
                          console.log(data.receiver.balance);
                          toUser
                            .update({
                              jobCents: data.receiver.balance
                            })
                            .then(touser => {
                              //   const html = <h1>hello</h1>
                              awsEmail.sendMail(
                                data.fromUser.email,
                                data.toUser.email
                              );
                              data.toUser = touser;
                              res.status(200).send(data);
                            })
                            .catch(err => {
                              console.log(err);
                            });
                        });
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(400).send("error");
                  });
              } else {
                return res.status(400).send("not enough jobCents");
              }
            })
            .catch(error => {
              console.log(error);
              res.status(400).send(error);
            });
        } else if (fromBalance >= amount) {
          keyPair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
          new Promise(function(resolve, reject) {
            nCentSDKInstance.transferTokens(
              keyPair,
              toUser.publicKey,
              tokenType,
              amount,
              resolve,
              reject
            );
          })
            .then(transfer => {
              console.log(transfer.data);
              data = transfer.data;
              Transfer.create({
                from,
                to,
                amount
              }).then(transfer => {
                console.log("data sender balance");
                console.log(data.sender.balance);
                fromUser
                  .update({
                    jobCents: data.sender.balance
                  })
                  .then(fromuser => {
                    data.fromUser = fromuser;
                    console.log("data receiver balance");
                    console.log(data.receiver.balance);
                    toUser
                      .update({
                        jobCents: data.receiver.balance
                      })
                      .then(touser => {
                        //   const html = <h1>hello</h1>
                        //   email.sendMail(data.fromUser.email, data.toUser.email, html);
                        data.toUser = touser;
                        res.status(200).send(data);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  });
              });
            })
            .catch(err => {
              console.log(err);
              res.status(400).send("error");
            });
        } else {
          return res.status(400).send("not enough jobCents");
        }
      })
      .catch(err => {
        res.status(400).send(err);
      });
  },
  findAll(req, res) {
    let data = {};
    Transfer.findAll({
      where: {
        from: req.body.user.email
      }
    })
      .then(sent => {
        console.log(sent);
        data.sent = sent;
        return Transfer.findAll({
          where: {
            to: req.body.user.email
          }
        });
      })
      .then(received => {
        console.log(received);
        data.received = received;
        res.status(200).send(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  }
};
