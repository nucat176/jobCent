const User = require("../models").User;
const otplib = require("./users.js").otplib;

module.exports = {
  create(req, res) {
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        const confirmationCode = req.body.code;
        if (user) {
          const time = Date.now();
          console.log(typeof confirmationCode + " " + confirmationCode);
          console.log(typeof user.otpKey + " " + user.otpKey);

          const validCode = otplib.authenticator.check(
            confirmationCode,
            user.otpKey
          ) && user.otpExp > Date.now();
          console.log("is the code valid? " + validCode);
          if (validCode) {
            console.log("code valid! logging in...");
          } else {
            console.log("code invalid");
          }
        } else {
          console.log("no user found");
        }
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  }
};
