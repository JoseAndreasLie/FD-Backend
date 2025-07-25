const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create the user first
        const userId = uuidv4();

        await queryInterface.bulkInsert('users', [
            {
                id: userId,
                username: 'Cantika',
                email: 'cantika@gmail.com',
                password: bcrypt.hashSync('123456', 10),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        // Create booths for the user
        return queryInterface.bulkInsert('booths', [
            {
                id: uuidv4(),
                name: "Cantika's Fashion Booth",
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('booths', null, {});
        return queryInterface.bulkDelete('users', null, {});
    },
};
