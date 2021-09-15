module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define('User', {
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
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        refresh_token:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        role:{
            type: DataTypes.ENUM,
            values: ['admin','employee'],
            allowNull: false,
            defaultValue: 'employee'
        },
        active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        tableName: 'users',
        timestamps: true
    });
    return User;
}