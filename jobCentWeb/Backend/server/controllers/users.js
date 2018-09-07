const User = require("../models").User;
const otplib = require("otplib");
const email = require("./email.js");
const nodemailer = require("nodemailer");

module.exports = {
  otplib: otplib,
  create(req, res) {
    const otpKey = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(otpKey);

    User.findOne({ where: { email: req.body.email } }).then(user => {
      let html = "your confirmation code is: <b>" + token + "</b>";
      var otpExp = Date.now() + 300000;
      console.log("otp expiration time: " + otpExp);
      if (user) {
        return user
          .update({
            otpKey: otpKey,
            otpExp: otpExp
          })
          .then(user => {
            console.log(typeof otpKey + otpKey);
            console.log(typeof token + token);
            const validCode = otplib.authenticator.check(token, otpKey);
            console.log("initially valid? " + validCode);
            
            
            email.sendMail(html, res);
            res.status(200).send(user)
          })
          .then(user => res.status(200).send(user))
          .catch(error => res.status(400).send(error));
      } else {
        return (
          User.create({
            email: req.body.email,
            otpKey: otpKey,
            otpExp: otpExp
          })
            //   .then(user => {
            //     email.sendMail('<b>hello world</b>');
            //   })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error))
        );
      }
    });
  }
};
