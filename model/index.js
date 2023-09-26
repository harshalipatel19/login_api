
const dbconfig = require('../config/config.js')

const {Sequelize,DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbconfig.db,
    dbconfig.user,
    dbconfig.password,{
        host : dbconfig.host,
        dialect :dbconfig. dialcet,
        operatorsAliases: false,   
    },{
        pool:{
            max : dbconfig.pool.max, 
            min: dbconfig.pool.min,
           acquire : dbconfig.pool.acquire,
           idle : dbconfig.pool.idle,
        }
    }
    );

sequelize.authenticate()
.then(() => {
    console.log("connected");
}).catch(err =>{
    console.log("error",err);
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.user  = require('./user.js')(sequelize,DataTypes)
db.password_reset  = require('./password_resert.js')(sequelize,DataTypes)
db.sequelize.sync({force :false})
.then(()=>{
    console.log("yess re-sync");
})
module.exports = db;