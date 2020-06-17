"use strict";

module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    "post",
    {
      caption: { type: DataTypes.STRING, defaultValue: "", allowNull: false },
      imageURL: { type: DataTypes.STRING, allowNull: false },
      likes_num: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
      comments_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {}
  );
  post.associate = function (models) {
    // associations can be defined here
    post.belongsTo(models.user);
    post.hasMany(models.like);
  };
  return post;
};
