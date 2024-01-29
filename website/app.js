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

app.get("/monster_creation", (req,res) => {
    res.render("monster_creation", {text: "miao"})
})

app.get("/microtransactions", (req,res) => {
    res.render("microtransactions", {text: "miao"})
})

app.get("/missions", (req,res) => {
    res.render("missions", {text: "miao"})
})

app.get('/api/dati', (req, res) => {
    // Esempio di dati da inviare come risposta
    const dati = {
      nome: 'John',
      cognome: 'Doe'
    };
  
    res.json(dati);
});


app.listen(port,()=>{
    console.log("App listening on port "+port);
});