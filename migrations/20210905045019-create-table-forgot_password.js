'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('forgot_password', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false
      },
      reset_token:{
        type: Sequelize.TEXT,
        allowNull: true
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
     await queryInterface.addConstraint('forgot_password', {
      type: 'foreign key',
      name: 'FORGOT_PASSWORD_USER_ID',
      fields: ['user_id'],
      references: {
        table:'users',
        field:'id'
      }
    })
},

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('forgot_password');
  }
};
