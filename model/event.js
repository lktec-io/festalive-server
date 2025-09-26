const { DataTypes } = require("sequelize");
const sequelize = require("../database/registration"); // hakikisha hii inarejea connection yako ya Sequelize

const Event = sequelize.define("event", {
     id: { type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
     },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "events",
  timestamps: true, // inakuwezesha createdAt na updatedAt
});

module.exports = Event;
