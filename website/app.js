const http = require('http')
const fs = require('fs')
const express = require('express')
var path = require('path')
var dotenv = require('dotenv')
const app = express()
const port = 3000


dotenv.config();


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

//Index.ejs page
app.get("/", (req,res) => {
    res.render("index");
});

//homepage.ejs
app.get("/homepage",(req,res)=>{
    //TODO: Aggiungere controllo
    res.render("homepage");
});
    


app.get("/battle", (req,res) => {
    res.render("pokemon_battle")
});



//const userRouter = require("./routers/users")

//app.use("/users", userRouter)

app.listen(port,()=>{
    console.log("App in ascolto su "+port);
});