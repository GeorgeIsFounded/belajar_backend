'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaProduk: {
        allowNull: false,
        type: Sequelize.STRING
      },
      harga: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      deskripsi: {
        type: Sequelize.STRING
      },
      brand: {
        allowNull: false,
        type: Sequelize.STRING
      },
      stok: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('produks');
  }
};