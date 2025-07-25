'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('queue_entries', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            device_id: {
                type: Sequelize.STRING,
            },
            booth_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'booths',
                    key: 'id',
                },
            },
            flashsale_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'flashsales',
                    key: 'id',
                },
            },
            ticket_code: {
                type: Sequelize.STRING,
            },
            queue_number: {
                type: Sequelize.INTEGER,
            },
            join_time: {
                type: Sequelize.DATE,
            },
            called_time: {
                type: Sequelize.DATE,
            },
            served_time: {
                type: Sequelize.DATE,
            },
            status: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('queue_entries');
    },
};
