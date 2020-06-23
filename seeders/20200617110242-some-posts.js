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

          likes_num: 2,

          comments_num: 0,

          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "I am so cute, you can't resist",

          likes_num: 0,

          comments_num: 0,

          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "Cat bites finger",

          likes_num: 2,

          comments_num: 0,

          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "Hmm?",

          likes_num: 1,

          comments_num: 0,

          userId: user2.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: "Yes I am a seal",

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
