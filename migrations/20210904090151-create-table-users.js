'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name:{
         type: Sequelize.STRING,
         allowNull: false
      },
      email:{
         type: Sequelize.STRING,
         allowNull: false
      },
      password:{
         type: Sequelize.STRING,
         allowNull: false
      },
      refresh_token:{
        type: Sequelize.TEXT,
        allowNull: true
      },
      role:{
        type: Sequelize.ENUM,
        values: ['admin','employee'],
        allowNull: false
      },
      active:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      status:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
       created_at:{
         type:Sequelize.DATE,
         allowNull:false
       },
       updated_at:{
         type:Sequelize.DATE,
         allowNull:false
       }
     });
     await queryInterface.addConstraint('users', {
       type:'unique',
       fields: ['email'],
       name: 'UNIQUE_USERS_EMAIL'
     })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
