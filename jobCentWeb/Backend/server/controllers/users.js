const User = require("../models").User;
const otplib = require("otplib");
const email = require("./email.js");
const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");

module.exports = {
  otplib: otplib,
  create(req, res) {
    const otpKey = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(otpKey);
    const validEmail = true;
    const html = "your jobCent confirmation code is: <b>" + token + "</b>";
    const otpExp = Date.now() + 300000;
    const salt = bcrypt.genSaltSync();
    const tokenHash = bcrypt.hashSync(token, salt);
    
    // console.log("otp expiration time: " + otpExp);
    // console.log(req.body);
    const emailAddr = req.body.user.email;
    // const emailAddr = req.body.email;
    // console.log(req.body);
    

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
            // const validCode = otplib.authenticator.check(token, otpKey);
            const validCode = bcrypt.compareSync(token, tokenHash);
            console.log("initially valid? " + validCode);

            // email.sendMail(html, res);
            res.status(200).send(user.email);
          })
          .catch(error => res.status(400).send(error));
      } else if (validEmail) {
        return User.create({
          email: emailAddr,
          otpKey: tokenHash,
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
