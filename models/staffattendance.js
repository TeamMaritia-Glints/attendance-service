'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StaffAttendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  StaffAttendance.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },      
    timestamp: {
      allowNull: false,
      type: DataTypes.DATE
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING
    },
    distanceFromOffice: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    employeeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'id', 
     }
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['CHECK-IN', 'CHECK-OUT']
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'StaffAttendance',
  });
  return StaffAttendance;
};