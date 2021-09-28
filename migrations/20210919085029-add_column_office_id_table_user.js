'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'users',
      'office_id',
      {
        type: Sequelize.INTEGER,
        after: "status",
        onDelete: 'CASCADE',
        references: {
          model: 'office',
          key: 'id',
          as: 'office_id',
        }
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'office_id'
    );
  }
};
