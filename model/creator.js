const { DataTypes } = require("sequelize");
const sequelize = require("../database/registration"); 
const bcrypt = require("bcrypt");
sequelize.sync();

const Creator = sequelize.define("creator", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true   
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
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stageName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  socials: { 
    type: DataTypes.JSON,
    allowNull: false, 
    defaultValue: [] 
  },
  socialPlatform: { 
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [] 
  },
  currentSocial: { 
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  categories: { 
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: [] 
  },
  currentCategory: { 
    type: DataTypes.JSON, 
    allowNull: false, 
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "creator",
  timestamps: true,
});

module.exports = Creator;
