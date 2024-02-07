const http = require('http')
const fs = require('fs')
const express = require('express')
var path = require('path')
const cors = require('cors');
var dotenv = require('dotenv')
const app = express()
const port = 3000

const corsOptions = {
    origin: 'http://localhost:5000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

app.use(cors(corsOptions));

dotenv.config();


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))


//--------------Endpoints needed to load the contract's abis--------------------
app.get("/GameContractJSON",(req,res)=>{
    fs.readFile('../AEtherMon/build/contracts/GameContract.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Errore nella lettura del file JSON:', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
    
        // Converti il contenuto del file JSON in un oggetto JavaScript
        const jsonData = JSON.parse(data);
    
        // Invia il file JSON come risposta
        res.json(jsonData);
    });
});

app.get("/AEMonsterNFTJSON",(req,res)=>{
    fs.readFile('../AEtherMon/build/contracts/AEMonsterNFT.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Errore nella lettura del file JSON:', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
    
        // Converti il contenuto del file JSON in un oggetto JavaScript
        const jsonData = JSON.parse(data);
    
        // Invia il file JSON come risposta
        res.json(jsonData);
    });
});



//Index.ejs page
app.get("/", (req,res) => {
    res.render("index");
});

//homepage.ejs
app.get("/homepage",(req,res)=>{
    res.render("homepage");
});
    

app.get("/battle", (req,res) => {
    res.render("battle")
});

app.get("/monster_creation", (req,res) => {
    res.render("monster_creation")
})

app.get("/microtransactions", (req,res) => {
    res.render("microtransactions")
})

app.get("/market",(req,res)=>{
    res.render("market");
});

app.get("/missions", (req,res) => {
    res.render("missions")
})


app.listen(port,()=>{
    console.log("App listening on port "+port);
});