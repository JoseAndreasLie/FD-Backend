'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            role_id: {
                type: Sequelize.UUID,
                allowNull: true,
                // references: {
                //     model: 'roles',
                //     key: 'id',
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'SET NULL',
            },
            // status: {
            //     type: Sequelize.INTEGER,
            // },
            // email_verified: {
            //     type: Sequelize.INTEGER,
            // },
            // address: {
            //     type: Sequelize.STRING,
            // },
            // phone_number: {
            //     type: Sequelize.STRING,
            // },
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    },
};
