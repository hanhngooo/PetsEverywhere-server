"use strict";
module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define(
    "image",
    {
      public_Id: { type: DataTypes.STRING, allowNull: false },
      imageURL: { type: DataTypes.STRING, allowNull: false },
      postId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {}
  );
  image.associate = function (models) {
    // associations can be defined here
    image.belongsTo(models.post);
  };
  return image;
};
