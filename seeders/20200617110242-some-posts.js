"use strict";
const User = require("../models").user;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user1 = await User.findOne({ where: { email: "hanhngo@gmail.com" } });
    const user2 = await User.findOne({ where: { email: "marie@gmail.com" } });
    const user3 = await User.findOne({
      where: { email: "supermeow@gmail.com" },
    });

    return queryInterface.bulkInsert(
      "posts",
      [
        {
          caption: "New haircut",
          imageURL:
            "https://pbs.twimg.com/profile_images/1151916124474183680/2iZykkYm.png",

          likes_num: 2,

          comments_num: 0,

          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "I am so cute, you can't resist",
          imageURL: "https://media.timeout.com/images/105634590/image.jpg",

          likes_num: 0,

          comments_num: 0,

          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "Cat bites finger",
          imageURL:
            "https://ii1.pepperfry.com/media/catalog/product/c/u/494x544/cute-cat-white-silk-cushion-cover-by-stybuzz-cute-cat-white-silk-cushion-cover-by-stybuzz-rtdg0m.jpg",

          likes_num: 2,

          comments_num: 0,

          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "Hmm?",
          imageURL: "https://i.redd.it/npurcgsyftq21.jpg",

          likes_num: 1,

          comments_num: 0,

          userId: user2.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "Yes I am a seal",
          imageURL: "https://i.redd.it/w6pxnp6e8yxx.jpg",

          likes_num: 1,

          comments_num: 0,

          userId: user3.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("posts", null, {});
  },
};
