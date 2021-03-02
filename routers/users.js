const { Router } = require("express");

const User = require("../models").user;

const router = new Router();

//get all users

router.get("/all", async (request, response) => {
  try {
    const users = await User.findAll({
      attributes: ["name", "email", "id", "profile_pic"],
      order: [["createdAt", "DESC"]],
    });
    response.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
