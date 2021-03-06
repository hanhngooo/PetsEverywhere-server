const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const { SALT_ROUNDS } = require("../config/constants");
const { cloudinary } = require("../config/cloudinary");

const User = require("../models/").user;
const Post = require("../models").post;
const Image = require("../models").image;
const Like = require("../models").like;

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Post,
          include: { model: Image },
        },
        { model: Like },
      ],

      order: [[Post, "createdAt", "DESC"]],
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    console.log({ token, ...user.dataValues.posts });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }

  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });
    res.status(201).json({ token, ...newUser.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});
// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  const posts = await Post.findAll({
    where: { userId: req.user.id },
    include: { model: Image },
    order: [["createdAt", "DESC"]],
  });
  const likes = await Like.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
  });
  // don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues, posts, likes });
});

// get a profile by id
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({
    where: { id: userId },
    include: {
      model: Post,
      include: { model: Image },
      order: [["createdAt", "DESC"]],
    },
  });

  res.status(200).send(user);
});

// update personal infor: name, description
router.patch("/:userId", authMiddleware, async (req, res) => {
  const updatedUser = await User.findByPk(req.params.userId);
  const { name, description } = req.body;

  await updatedUser.update({ name, description });
  res.status(200).send(updatedUser);
});

// update new profile image
router.patch("/:userId/profilePic", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByPk(req.params.userId);
    const { profile_pic } = req.body;
    const uploadedResponse = await cloudinary.uploader.upload(profile_pic, {
      upload_preset: "pets-dev",
    });
    await updatedUser.update({ profile_pic: uploadedResponse.public_id });
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
