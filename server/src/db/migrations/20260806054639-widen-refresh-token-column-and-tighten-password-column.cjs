"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "refresh_token", {
      type: Sequelize.STRING(1024),
      allowNull: true,
    });
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "refresh_token", {
      type: Sequelize.STRING(512),
      allowNull: true,
    });
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(512),
      allowNull: false,
    });
  },
};
