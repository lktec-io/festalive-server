"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("creator", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      fullName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      stageName: {
        allowNull: true,
        type: Sequelize.STRING,
      },

       bio: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      socials: {
        type: Sequelize.JSON,
      },
      socialPlatform: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      currentSocial: {
        allowNull: true,
        type: Sequelize.STRING,
      },
       categories: {
        type: Sequelize.JSON,
      },
      currentCategory: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING,
      },
       phone: {
        allowNull: true,
        type: Sequelize.STRING,
      },
       website: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("creator");
  },
};
