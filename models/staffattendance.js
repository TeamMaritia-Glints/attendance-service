"use strict";

const { Model } = require("sequelize");
const { User } = require("./User");

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
  }
  StaffAttendance.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      employeeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      checkInTime: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      checkOutTime: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      checkInLocation: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      checkOutLocation: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: true,
        type: DataTypes.ENUM("Approved", "Waiting for Approval","Declined"),
      },
      workingHour: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      workingHourView: {
        type: DataTypes.VIRTUAL,
        get() {
          const hour = parseInt(this.workingHour / 60);
          const minute = this.workingHour % 60;
          return `${hour} h ${minute} m`;
        },
        set(value) {
          throw new Error("Do not try to set the `workingHourView` value!");
        }
      },  
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "StaffAttendance",
    }
  );

  StaffAttendance.associate = function (models) {
    // associations can be defined here
    StaffAttendance.belongsTo(models.User, {
      foreignKey: "employeeId",
    });
  };

  return StaffAttendance;
};
