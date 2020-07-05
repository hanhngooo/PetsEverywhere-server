const { Router } = require("express");
const auth = require("../auth/middleware");
const { cloudinary } = require("../config/cloudinary");

const Post = require("../models").post;
const User = require("../models").user;
const Image = require("../models").image;
const Like = require("../models").like;
const Comment = require("../models").comment;

const router = new Router();

//get all posts
router.get("/all", async (request, response) => {
  try {
    const posts = await Post.findAll({
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
    response.status(200).send(posts);
  } catch (error) {
    console.log(error);
  }
});

// upload new post
router.post("/uploadFile", auth, async (request, response) => {
  try {
    const user = await User.findByPk(request.user.id);
    const { imageURL, caption } = request.body; // reveive data from request
    if (!imageURL) {
      return response
        .status(400)
        .send({ message: "A post must have an image/video" });
    }
    const uploadedResponse = await cloudinary.uploader.upload(imageURL, {
      upload_preset: "pets-dev",
    }); // upload it to cloudinary

    const newPost = await Post.create({
      caption,
      userId: user.id,
    });
    const newImage = await Image.create({
      public_Id: uploadedResponse.public_id,
      imageURL: uploadedResponse.secure_url,
      postId: newPost.id,
    });
    const newPostWithImage = Object.assign(newPost.dataValues, {
      images: [newImage.dataValues],
    });

    return response.status(201).send(newPostWithImage);
  } catch (error) {
    console.log(error);
  }
});

// delete a post
router.delete("/:id/delete", auth, async (request, response) => {
  try {
    const postId = request.params.id;
    const userId = parseInt(request.user.id);
    const postToDelete = await Post.findOne({
      where: { id: postId },
      include: [{ model: Like }, { model: Image }, { model: Comment }],
    });

    if (!postToDelete) {
      response.status(404).send({ message: "Post not found" });
    } else {
      if (postToDelete.userId !== userId) {
        response
          .status(403)
          .send({ message: "You are not authorized to delete this post" });
      } else {
        const postDeleted = await postToDelete.destroy();
      }
    }
    return response.status(204).send({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
