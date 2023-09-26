
module.exports = (sequelize,DataTypes)=>{


    const password_reset = sequelize.define('password_reset',{
        Email: {
            type: DataTypes.STRING,
            required: true,
        },
        token: {
            type:DataTypes.STRING,
            required: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            default: Date.now,
            expires: 3600,
        },
    },{
        modelName: 'password_reset',
        timestamps: false
    });
    return password_reset;
}