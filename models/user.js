"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pets-dev/yeokmku4hdt05c3780gp",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
    },
    {}
  );
  user.associate = function (models) {
    user.hasMany(models.post);
    user.hasMany(models.like);
    user.hasMany(models.comment);
  };
  return user;
};
