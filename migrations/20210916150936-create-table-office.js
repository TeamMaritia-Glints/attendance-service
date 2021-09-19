'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('office', { 
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
      address:{
        type: Sequelize.TEXT,
        allowNull: true
      },
      latitude:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      longitude:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      status:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      create_uid: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'create_uid',
        }
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
    //  await queryInterface.addConstraint('office', {
    //   type: 'foreign key',
    //   name: 'OFFICE_USER_ID',
    //   fields: ['create_uid'],
    //   references: {
    //     table:'users',
    //     field:'id'
    //   }
    // })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('office');
  }
};
