"use strict";
module.exports = (sequelize, DataTypes) => {
  const like = sequelize.define(
    "like",
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      postId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {}
  );
  like.associate = function (models) {
    // associations can be defined here
    like.belongsTo(models.user);
    like.belongsTo(models.post);
  };
  return like;
};
