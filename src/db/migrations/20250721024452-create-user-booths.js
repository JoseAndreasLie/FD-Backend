'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.createTable('user_booths', {
        //     id: {
        //         allowNull: false,
        //         primaryKey: true,
        //         type: Sequelize.UUID,
        //     },
        //     user_id: {
        //         type: Sequelize.UUID,
        //     },
        //     booth_id: {
        //         type: Sequelize.UUID,
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
        // await queryInterface.dropTable('user_booths');
    },
};
