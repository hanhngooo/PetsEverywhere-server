const { Router } = require("express");
const router = new Router();
const auth = require("../auth/middleware");
const { cloudinary } = require("../config/cloudinary");

const Post = require("../models").post;
const User = require("../models").user;
const Image = require("../models").image;

router.get("/", async (request, response) => {
  const posts = await Post.findAll({ include: { model: Image } });
  response.status(200).send(posts);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const post = await Post.findOne({
    where: { id: id },
  });
  response.status(200).send(post);
});

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

    console.log("uploaded", uploadedResponse);

    const newPost = await Post.create({
      caption,
      userId: user.id,
    });
    const newImage = await Image.create({
      public_Id: uploadedResponse.public_id,
      imageURL: uploadedResponse.secure_url,
      postId: newPost.id,
    });

    return response.status(201).json(newPost);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
