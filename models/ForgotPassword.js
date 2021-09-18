module.exports = (sequelize, DataTypes) =>{
    const ForgotPassword = sequelize.define('ForgotPassword', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
           },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
           },   
        reset_token:{
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'forgot_password',
        timestamps: true
    });

    return ForgotPassword;
}