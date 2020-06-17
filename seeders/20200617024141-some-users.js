module.exports = {
  up: (queryInterface, Sequelize) => {
    const saltRounds = 10;
    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Hanh Ngo",
          email: "hanhngo@gmail.com",
          password: bcrypt.hashSync("hanhngo123", saltRounds),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dummy",
          email: "dummy@dummy.com",
          password: bcrypt.hashSync("dummy1234", saltRounds),
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
