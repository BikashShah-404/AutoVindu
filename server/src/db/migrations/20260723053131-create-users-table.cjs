"use strict";

const TABLE_OPTS = { charset: "utf8mb4", collate: "utf8mb4_unicode_ci" };

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        password: { type: Sequelize.STRING(512), allowNull: false },
        phone: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
        role: {
          type: Sequelize.ENUM(
            "super_admin",
            "admin",
            "content_manager",
            "data_entry",
            "customer_support",
            "user",
          ),
          allowNull: false,
          defaultValue: "user",
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      TABLE_OPTS,
    );

    await queryInterface.addIndex("users", {
      fields: ["email"],
      unique: true,
    });

    await queryInterface.addIndex("users", {
      fields: ["username"],
      unique: true,
    });

    await queryInterface.addIndex("users", {
      fields: ["role"],
    });

    await queryInterface.addIndex("users", {
      fields: ["phone"],
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
