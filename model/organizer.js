const { DataTypes } = require("sequelize");
const sequelize = require("../database/registration");
const bcrypt = require("bcrypt");
sequelize.sync();

const Organizer = sequelize.define(
  "organizer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizerType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING, // 🔹 badilisha kutoka INTEGER kwa sababu namba za simu zinaweza kuwa na leading zeros
      allowNull: false,
    },
    businessLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxId: {
      type: DataTypes.STRING, // 🔹 pia STRING kwa same reason
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    socialMedia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "organizer",
    timestamps: true,
    hooks: {
      beforeCreate: async (organizer) => {
        if (organizer.password) {
          const salt = await bcrypt.genSalt(10);
          organizer.password = await bcrypt.hash(organizer.password, salt);
        }
      },
      beforeUpdate: async (organizer) => {
        if (organizer.password) {
          const salt = await bcrypt.genSalt(10);
          organizer.password = await bcrypt.hash(organizer.password, salt);
        }
      },
    },
  }
);

module.exports = Organizer;
