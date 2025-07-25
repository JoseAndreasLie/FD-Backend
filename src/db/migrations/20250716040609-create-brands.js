'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.createTable('brands', {
        //     id: {
        //         allowNull: false,
        //         primaryKey: true,
        //         type: Sequelize.UUID,
        //     },
        //     name: {
        //         allowNull: false,
        //         type: Sequelize.STRING,
        //     },
        //     created_at: {
        //         allowNull: false,
        //         type: Sequelize.DATE,
        //     },
        //     updated_at: {
        //         allowNull: false,
        //         type: Sequelize.DATE,
        //     },
        //     deleted_at: {
        //         allowNull: true,
        //         type: Sequelize.DATE,
        //     },
        // });
    },
    async down(queryInterface, Sequelize) {
        // await queryInterface.dropTable('brands');
    },
};
