import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

const UserModel = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    blocked: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: false,
    },
    userBlockedTime: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    modelName: "UserModel",
    indexes: [
      {
        fields: ["email"],
        unique: true,
      },
    ],
  }
);
UserModel.sync();

export default UserModel;
