const { Router } = require("express");
const router = new Router();
const auth = require("../auth/middleware");
const { cloudinary } = require("../config/cloudinary");

const Post = require("../models").post;
const User = require("../models").user;

router.get("/", async (request, response) => {
  const posts = await Post.findAll();
  response.status(200).send(posts);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const post = await Post.findOne({
    where: { id: id },
  });
  response.status(200).send(post);
});

router.post("/uploadFile", async (request, response) => {
  try {
    // const user = await User.findByPk(request.user.id);
    const { imageURL } = request.body;
    if (!imageURL) {
      return response
        .status(400)
        .send({ message: "A post must have an image/video" });
    }
    const uploadedResponse = await cloudinary.uploader.upload(imageURL);

    console.log("uploaded", uploadedResponse);

    const newPost = await Post.create({
      imageURL: uploadedResponse.url,
      userId: 3,
    });
    return response.status(201).send({ message: "New post is created" });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
