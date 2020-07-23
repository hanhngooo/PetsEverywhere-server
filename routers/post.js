const { Router } = require("express");
const authMiddleware = require("../auth/middleware");

const User = require("../models").user;
const Post = require("../models").post;
const Image = require("../models").image;
const Like = require("../models").like;
const Comment = require("../models").comment;

const router = new Router();

// get a single post
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const post = await Post.findOne({
      where: { id: id },
      include: [
        { model: Image },
        { model: User, attributes: ["name", "profile_pic"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["name", "profile_pic"] }],
          order: [["createdAt", "DESC"]],
        },
      ],

      order: [["createdAt", "DESC"]],
    });
    response.status(200).send(post);
  } catch (error) {
    console.log(error);
  }
});

// like a post
router.post("/:postId/like", authMiddleware, async (req, res) => {
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

        await post.update({ likes_num: post.likes_num + 1 });
        return res.status(200).send({ message: "Like successfully", post });
      } else {
        return res.status(400).send({ error: "You already liked this post" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/:postId/allLikes", authMiddleware, async (req, res) => {
  const likes = await Like.findAll({ where: { postId: req.params.postId } });
  res.status(200).send({ message: "All likes of this post", likes });
});

//unlike a post
router.post("/:postId/unlike", authMiddleware, async (req, res) => {
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

        await post.update({ likes_num: post.likes_num - 1 });
        return res.status(200).send({ message: "Unliked successfully", post });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// get all comments of a post
router.get("/:postId/allComments", async (req, res) => {
  const comments = await Comment.findAll({
    where: { postId: req.params.postId },
  });
  res.status(200).send({ message: "All comments of this post", comments });
});

// add a new comment
router.post("/:postId/comment", authMiddleware, async (request, response) => {
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
});

// delete a comment
router.delete(
  "/:postId/comment/:commentId/delete",
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
