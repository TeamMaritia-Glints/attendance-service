module.exports = (sequelize, DataTypes) =>{
    const Office = sequelize.define('Office', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },   
        address:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        latitude:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        longitude:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        create_uid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt:{
            field: 'created_at',
            type : DataTypes.DATE,
            allowNull: true
        },
        updatedAt:{
            field: 'updated_at',
            type : DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'office',
        timestamps: true
    });
    Office.associate = function(models) {
        // associations can be defined here
        Office.belongsTo(models.User, {
          foreignKey: 'create_uid',
          onDelete: 'CASCADE'
        })
      };

    return Office;
}