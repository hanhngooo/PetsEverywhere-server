"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "likes",
      [
        {
          userId: 1,
          postId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          postId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          postId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          postId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          postId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          postId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("likes", null, {});
  },
};
