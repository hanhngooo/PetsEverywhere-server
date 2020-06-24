const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Hanh Ngo",
          email: "hanhngo@gmail.com",
          password: bcrypt.hashSync("hanhngo123", SALT_ROUNDS),
          description: "I am here because mt cat told me to",
          profile_pic: "pets-dev/khhtiuzfhpylhg6zgcrk",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Marie ",
          email: "marie@gmail.com",
          password: bcrypt.hashSync("marie123", SALT_ROUNDS),
          description: "here for sharing unforgetable moments of my babies",
          profile_pic: "pets-dev/wrqiopp3kpngdyghdpht",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Supermeow",
          email: "supermeow@gmail.com",
          password: bcrypt.hashSync("supermeow123", SALT_ROUNDS),
          description: "I am super....meow",
          profile_pic: "pets-dev/aq69xioa0nplitzudich",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
