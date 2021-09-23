'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StaffAttendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },      
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE
      },
      location: {
        allowNull: false,
        type: Sequelize.STRING
      },
      distanceFromOffice: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      employeeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users', 
          key: 'id', 
       }
      },
      action: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['CHECK-IN', 'CHECK-OUT']
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('StaffAttendances');
  }
};