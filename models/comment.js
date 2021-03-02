"use strict";
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    "comment",
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {}
  );
  comment.associate = function (models) {
    // associations can be defined here
    comment.belongsTo(models.user);
    comment.belongsTo(models.post);
  };
  return comment;
};
