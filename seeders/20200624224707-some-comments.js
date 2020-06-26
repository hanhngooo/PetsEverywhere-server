"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "comments",
      [
        {
          userId: 1,
          postId: 1,
          content: "Wow so cute",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          postId: 1,
          content: "I love this photo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          postId: 2,
          content: "Adorable!",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          postId: 4,
          content: "I want to adopt this baby",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          postId: 2,
          content: "This made my day!",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("comments", cascade, {});
  },
};
