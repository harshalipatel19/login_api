
module.exports = (sequelize,DataTypes)=>{


    const user = sequelize.define('user',{
        UserName:{
            type : DataTypes.STRING,
        },
        Email : {
            type : DataTypes.STRING
        },
        PhoneNo:{
            type : DataTypes.STRING
        },
       Address : {
            type : DataTypes.STRING
        },
        Gender :{
            type : DataTypes.TEXT,
        },
        Password :{
            type : DataTypes.STRING,
        },
       Token :{
            type : DataTypes.TEXT,
        },
        IsActive :{
            type : DataTypes.INTEGER,
        }
    },{
        modelName: 'User',
        timestamps: false
    });
    return user;
}