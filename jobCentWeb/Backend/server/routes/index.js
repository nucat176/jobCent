const sessionController = require('../controllers/').sessionController;
const usersController = require('../controllers').usersController;


module.exports = app => {
  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the jobCent API!"
    })
  );

  app.post("/api/user", usersController.create);
  app.post("/api/session", sessionController.create);
};
