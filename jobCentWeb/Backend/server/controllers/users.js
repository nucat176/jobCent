const User = require("../models").User;
const otplib = require("otplib");
const email = require("./email.js");
const bcrypt = require("bcrypt");
const keys = require("./secret.js");
const nCentSDK = require("../../../../../ncent-SDK.js/source/ncentSDK");
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
    // const emailAddr = req.body.user.email;
    // const otpReq = req.body.user.otpReq;
    // vars below for testing
    const otpReq = req.body.otpReq;
    const jobCents = req.body.jobCents;
    const emailAddr = req.body.email;
    

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
            res.status(200).send(user.email);
          })
          .catch(error => res.status(400).send(error));
      } else if (validEmail) {
        let data = {};
        if (otpReq) {
          return User.create({
            email: emailAddr,
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
              res.status(201).send(user);
            })
            .catch(error => {
              console.log(error);
  
              res.status(400).send(error);
            });
        } else {
          return User.create({
            email: emailAddr,
            jobCents: jobCents,
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
    // const user = req.session.user;
    // new Promise(function(resolve, reject) {
      
      // nCentSDKInstance.getTokenBalance(
      //   "GCALDTPTVOK6QXJOZ7PKZX2I3T7DZOOHFVUQM67VY44LOIOEW6VSLFWR",
      //   "9982fd4f-ec11-4a28-96d2-b34036e2e03b",
      //   resolve,
      //   reject
      // );
    // })
    User.findOne({ where: { id: req.params.id } })
      .then(user => {
        // console.log(token);

        // console.log(token.data[0]);
        // console.log(token.data[0].balance);
        // this.setState({ jobCents: token.balance });

        console.log(user.dataValues);
        res.status(200).send({ balance: 100 });
      })
      .catch(error => {
        console.log(error);
        res.status(400).send("error");
      });
    // in the future update this to use session tokens for search
    // User.findOne({ where: { id: user.id } }).then(user => {

    // })
  }
};
