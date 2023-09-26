module.exports ={
    host : 'localhost',
    user : 'root',
    password : '',
    db : process.env.DBNAME,
    dialcet : 'mysql',
    logging:false,

    pool :{
        max: 5,
        min: 0,
        acquire : 30000,
        idle : 10000
    }
}