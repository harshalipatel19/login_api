const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const port = process.env.PORT;

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static('public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("this is tesing route")
})

//router
const userrouter = require('./router/userroute');   
app.use('/',userrouter); 

//const webroute = require('./router/webroute')
//app.use('/',webroute)

app.listen(port,(req,res)=>{
    console.log(`api is running at http://localhost:${port}`);
})