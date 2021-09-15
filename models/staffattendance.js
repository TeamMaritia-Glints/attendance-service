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
    id: DataTypes.INTEGER,
    timeStamp: DataTypes.DATE,
    location: DataTypes.STRING,
    distanceFromOffice: DataTypes.FLOAT,
    employeeId: DataTypes.INTEGER,
    action: DataTypes.ENUM 
  }, {
    sequelize,
    modelName: 'StaffAttendance',
  });
  return StaffAttendance;
};