const { DataTypes } = require("sequelize");
const sequelize = require("../database/registration"); 
const bcrypt = require("bcrypt");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,   
    validate: {
      matchesPassword(value) {
        if (value !== this.password) {
          throw new Error("Password hailingani na Confirm Password");
        }
      },
    },
  },
}, {
  tableName: "users",
  timestamps: true,
  hooks: {
    beforeCreate: async (User) => {
      if (User.password) {
        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(User.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (User.password) {
        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(User.password, salt);
      }
    },
  },
});
module.exports = User;
