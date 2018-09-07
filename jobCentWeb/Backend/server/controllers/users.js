const User = require("../models").User;
const otplib = require("otplib");
const email = require("./email.js");
// const nodemailer = require("nodemailer");

module.exports = {
  otplib: otplib,
  create(req, res) {
    const otpKey = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(otpKey);
    const validEmail = true;
    const html = "your jobCent confirmation code is: <b>" + token + "</b>";
    const otpExp = Date.now() + 300000;
    // console.log("otp expiration time: " + otpExp);

    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        return user
          .update({
            otpKey: otpKey,
            otpExp: otpExp
          })
          .then(user => {
            console.log(typeof otpKey + " " + otpKey);
            console.log(typeof token + " " + token);
            const validCode = otplib.authenticator.check(token, otpKey);
            console.log("initially valid? " + validCode);

            // email.sendMail(html, res);
            res.status(200).send(user.email);
          })
          .catch(error => res.status(400).send(error));
      } else if (validEmail) {
        return User.create({
          email: req.body.email,
          otpKey: otpKey,
          otpExp: otpExp
        })
          .then(user => {
            console.log(typeof otpKey + " " + otpKey);
            console.log(typeof token + " " + token);
            const validCode = otplib.authenticator.check(token, otpKey);
            console.log("initially valid? " + validCode);
            // email.sendMail(html, res);
            res.status(201).send(user.email);
          })
          .catch(error => res.status(400).send(error));
      } else {
        res.status(400).send({ errors: ["Invalid email address"] });
      }
    });
  }
};
