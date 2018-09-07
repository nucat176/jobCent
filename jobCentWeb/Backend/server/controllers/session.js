const User = require("../models").User;
const otplib = require("./users.js").otplib;

module.exports = {
  create(req, res) {
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const confirmationCode = req.body.code;
          const expired = Date.now() > user.otpExp;
          const validCode =
          otplib.authenticator.check(confirmationCode, user.otpKey) &&
          !expired;
          console.log(typeof user.otpKey + " " + user.otpKey);
          console.log(typeof confirmationCode + " " + confirmationCode);
          console.log("expired? " + expired);
          console.log("is the code valid? " + validCode);
          if (validCode) {
            console.log("code valid! logging in...");
            //since user confirmed their email via the code, set their status to active
            user
              .update({
                active: true
              })
              .then(user => {
                const { id, email } = user.dataValues;
                const userInfo = { id, email };
                req.session.user = userInfo;
                res.send({ user: userInfo });
              });
          } else {
            res.status(400).send({
              errors: [
                "That doesn't look like the code we sent to " + req.body.email
              ]
            });
          }
        } else {
          res.status(400).send({ errors: ["user not found"] });
        }
      })
      .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    if (req.session.user && req.cookies.session_token) {
      res.clearCookie("session_token");
      res.status(200).send("Logged out successfully");
    } else {
      res.status(404).send("No user logged in to log out!");
    }
  }
};
