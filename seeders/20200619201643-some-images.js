"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "images",
      [
        {
          public_Id: "2iZykkYm_pym4rn",
          imageURL:
            "https://res.cloudinary.com/hanhngo/image/upload/v1592598140/pets-dev/2iZykkYm_pym4rn.png",
          postId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          public_Id: "image_degkzl",
          imageURL:
            "https://res.cloudinary.com/hanhngo/image/upload/v1592598159/pets-dev/image_degkzl.jpg",
          postId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          public_Id:
            "cute-cat-white-silk-cushion-cover-by-stybuzz-cute-cat-white-silk-cushion-cover-by-stybuzz-rtdg0m_lnvt9n",
          imageURL:
            "https://res.cloudinary.com/hanhngo/image/upload/v1592598178/pets-dev/cute-cat-white-silk-cushion-cover-by-stybuzz-cute-cat-white-silk-cushion-cover-by-stybuzz-rtdg0m_lnvt9n.jpg",
          postId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          public_Id: "npurcgsyftq21_akydud",
          imageURL:
            "https://res.cloudinary.com/hanhngo/image/upload/v1592598196/pets-dev/npurcgsyftq21_akydud.jpg",
          postId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          public_Id: "w6pxnp6e8yxx_f9oes4",
          imageURL:
            "https://res.cloudinary.com/hanhngo/image/upload/v1592598212/pets-dev/w6pxnp6e8yxx_f9oes4.jpg",
          postId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("images", null, {});
  },
};
