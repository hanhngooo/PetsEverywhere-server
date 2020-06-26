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
const Comment = require("../models").comment;

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
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.findAll({
    where: { userId: userId },
    include: { model: Image },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).send(posts);
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

// like a post
router.post("/post/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;
    const like = await Like.findOne({
      where: { userId: userId, postId: postId },
    });

    const post = await Post.findOne({
      where: { id: postId },
      include: [
        { model: Image },
        { model: User, attributes: ["name", "profile_pic"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["name", "profile_pic"] }],
          order: [["createdAt", "DESC"]],
        },
      ],
    });
    if (post === null) {
      res.status(400).send({ error: "Post does not exist" });
    } else {
      if (like === null) {
        const newLike = await Like.create({
          userId: userId,
          postId: postId,
        });
        post.likes_num++;
        await post.update({ likes_num: post.likes_num });
        return res.status(200).send({ message: "Like successfully", post });
      } else {
        return res.status(400).send({ error: "You already liked this post" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:postId/allLikes", authMiddleware, async (req, res) => {
  const likes = await Like.findAll({ where: { postId: req.params.postId } });
  res.status(200).send({ message: "All likes of this post", likes });
});

//unlike a post
router.post("/post/:postId/unlike", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;
    const like = await Like.findOne({
      where: { userId: userId, postId: postId },
    });

    const post = await Post.findOne({
      where: { id: postId },
      include: [
        { model: Image },
        { model: User, attributes: ["name", "profile_pic"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["name", "profile_pic"] }],
          order: [["createdAt", "DESC"]],
        },
      ],
    });
    if (post === null) {
      res.status(400).send({ error: "Post does not exist" });
    } else {
      if (like === null) {
        return res.status(400).send({ error: "You already unliked this post" });
      } else {
        await Like.destroy({ where: { userId: userId, postId: postId } });
        post.likes_num--;
        await post.update({ likes_num: post.likes_num });
        return res.status(200).send({ message: "Unliked successfully", post });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// add a new comment
router.get("/post/:postId/allComments", async (req, res) => {
  const comments = await Comment.findAll({
    where: { postId: req.params.postId },
  });
  res.status(200).send({ message: "All comments of this post", comments });
});

router.post(
  "/post/:postId/comment",
  authMiddleware,
  async (request, response) => {
    try {
      const user = await User.findByPk(request.user.id);
      const postId = request.params.postId;

      const { content } = request.body; // reveive data from request
      if (!content) {
        return response
          .status(400)
          .send({ message: "A comment must have a content" });
      }

      const newComment = await Comment.create({
        content,
        userId: user.id,
        postId: postId,
      });
      const post = await Post.findOne({
        where: { id: postId },
        include: [
          { model: Image },
          { model: User, attributes: ["name", "profile_pic"] },
          {
            model: Comment,
            include: [{ model: User, attributes: ["name", "profile_pic"] }],
            order: [["createdAt", "DESC"]],
          },
        ],
      });
      await post.update({ comments_num: post.comments_num + 1 });
      return response.status(201).send(post);
    } catch (error) {
      console.log(error);
    }
  }
);

// delete a comment
router.delete(
  "/post/:postId/comment/:commentId/delete",
  authMiddleware,
  async (request, response) => {
    try {
      const userId = parseInt(request.user.id);
      const commentId = parseInt(request.params.commentId);
      const postId = parseInt(request.params.postId);
      const post = await Post.findByPk(postId);
      const commentToDelete = await Comment.findByPk(commentId);
      if (!commentToDelete) {
        response.status(404).send({ message: "Comment not found" });
      } else {
        if (commentToDelete.userId !== userId) {
          response
            .status(403)
            .send({ message: "You are not authorized to delete this post" });
        } else {
          const commentDeleted = await commentToDelete.destroy();
          await post.update({ comments_num: post.comments_num - 1 });
        }
      }
      return response.status(204).send({ message: "Comment deleted" });
    } catch (error) {
      console.log(error);
    }
  }
);
module.exports = router;
