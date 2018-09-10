const User = require("../models").User;
const otplib = require("otplib");
const email = require("./email.js");
const awsEmail = require("./awsEmail.js");
const bcrypt = require("bcrypt");
const keys = require("./secret.js");
const aws = require("aws-sdk");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK();

module.exports = {
  otplib: otplib,
  create(req, res) {
    const otpKey = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(otpKey);
    // in the future write a parser to validate email address format.
    const validEmail = true;
    const html = "your jobCent confirmation code is: <b>" + token + "</b>";
    const otpExp = Date.now() + 300000;
    const salt = bcrypt.genSaltSync();
    const tokenHash = bcrypt.hashSync(token, salt);
    const emailAddr = req.body.user.email;
    const otpReq = req.body.user.otpReq;
    // variables below for testing
    // const otpReq = req.body.otpReq;
    // const emailAddr = req.body.email;
    // const jobCents = req.body.jobCents;

    User.findOne({ where: { email: emailAddr } }).then(user => {
      if (user) {
        return user
          .update({
            otpKey: tokenHash,
            otpExp: otpExp
          })
          .then(user => {
            console.log(typeof otpKey + " " + otpKey);
            console.log(typeof token + " " + token);
            const validCode = bcrypt.compareSync(token, tokenHash);
            console.log("initially valid? " + validCode);

            // email.sendMail(keys.from, keys.to, html);
            awsEmail.sendMail(keys.from, emailAddr, token);

            res.status(200).send(user.email);
          })
          .catch(error => res.status(400).send(error));
      } else if (validEmail) {
        let data = {};
        if (otpReq) {
          return User.create({
            email: emailAddr,
            jobCents: "0",
            otpKey: tokenHash,
            otpExp: otpExp
          })
            .then(user => {
              data.user = user;
              console.log(user);

              const wallet = nCentSDKInstance.createWalletAddress();
              data.privateKey = wallet.secret();
              data.publicKey = wallet.publicKey();
              return data;
            })
            .then(data => {
              console.log("storing keys..");
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              const validCode = otplib.authenticator.check(token, otpKey);
              console.log("initially valid? " + validCode);

              // email.sendMail(keys.from, keys.to, html);
              awsEmail.sendMail(keys.from, emailAddr, html);
              res.status(201).send(user);
            })
            .catch(error => {
              console.log(error);

              res.status(400).send(error);
            });
        } else {
          return User.create({
            email: emailAddr,
            jobCents: "0"
          })
            .then(user => {
              data.user = user;
              console.log(user);

              const wallet = nCentSDKInstance.createWalletAddress();
              data.privateKey = wallet.secret();
              data.publicKey = wallet.publicKey();
              return data;
            })
            .then(data => {
              console.log("storing keys..");
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              res.status(201).send(user);
            })
            .catch(error => {
              console.log(error);
              res.status(400).send(error);
            });
        }
      } else {
        res.status(400).send({ errors: ["Invalid email address"] });
      }
    });
  },

  getOne(req, res) {
    let data = {};
    const tokenType = "d3c5add3-382e-4505-815b-72221c7f0c45";
    // new Promise(function(resolve, reject) {
    //   nCentSDKInstance.getAllBalances(
    //     "GA545ZHIHD62GQ5OR3RX6YFZ4FUP2XXHMLLT4PFLAUMZKXNOXIIXCDQD",
    //     resolve,
    //     reject
    //   );
    // })
    const user = req.session.user;
    new Promise(function(resolve, reject) {
      nCentSDKInstance.getTokenBalance(
        user.publicKey,
        tokenType,
        resolve,
        reject
      );
    })
      .then(token => {
        data.token = token;
        return User.findOne({
          where: { id: req.params.id }
        });
      })
      .then(user => {
        return user.update({
          jobCents: data.token.data[0].balance
        });
      })
      .then(user => {
        data.user = user;
        console.log(data.token.data[0].balance);
        res.status(200).send({ balance: data.token.data[0].balance });
      })
      .catch(error => {
        console.log(error);
        res.status(400).send({ balance: 0 });
      });
    // in the future update this to use session tokens for search
    // User.findOne({ where: { id: user.id } }).then(user => {

    // })
  },
  update(req, res) {
    console.log(req);

    User.update(
      {
        name: req.body.user.name
      },
      { where: { email: req.body.user.from } }
    )
      .then(user => {
        console.log(user);
        res.status(200).send(user);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  }
};
