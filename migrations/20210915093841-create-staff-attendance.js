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
      employeeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users', 
          key: 'id', 
       }
      },
      checkInTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      checkOutTime: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      checkInLocation: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      checkOutLocation: {
        allowNull: true,
        type: Sequelize.STRING,
      },         
      status: {
        allowNull: false,
        type: Sequelize.ENUM("Approved","Waiting for Approval", "Declined"),
      },
      workingHour: {
        allowNull: true,
        type: Sequelize.INTEGER
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