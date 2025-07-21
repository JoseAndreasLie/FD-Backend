const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                uuid: uuidv4(),
                first_name: 'John',
                last_name: 'Doe',
                email: 'user@example.com',
                status: 1,
                email_verified: 1,
                password: bcrypt.hashSync('123456', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    },
};
