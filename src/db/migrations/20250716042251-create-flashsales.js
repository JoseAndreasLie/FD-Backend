'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('flashsales', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING,
            },
            booth_id: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'booths',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            date: {
                type: Sequelize.STRING, 
            },
            start_time: {
                type: Sequelize.STRING,
            },
            end_time: {
                type: Sequelize.STRING,
            },
            queue_early_access_time: {
                type: Sequelize.STRING,
            },
            flashsale_active_utc: {
                type: Sequelize.DATE,
            },
            flashsale_inactive_utc: {
                type: Sequelize.DATE,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('flashsales');
    },
};
