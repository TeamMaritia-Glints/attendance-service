'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
      name: 'Admin',
      email:'admin@email.com',
      role:'admin',
      status:true,
      password: await bcrypt.hash('admin123',10),
      created_at: new Date(),
      updated_at: new Date()
      },
      {
        name: 'User',
        email:'user@email.com',
        role:'employee',
        status:true,
        password: await bcrypt.hash('user123',10),
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
