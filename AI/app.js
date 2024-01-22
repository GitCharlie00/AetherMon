const express = require("express")
const app = express()
port = 3000
const Replicate = require("replicate")
const $ = require('jquery');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const REPLICATE_API_TOKEN="r8_Lk8WUhoI41tvInTYy3UUaee8igybfbR4ZthTl"

const url = 'http://localhost:5000/api/image'; 

async function save_images() {
  axios.get(url, { responseType: 'stream' })
    .then(response => {
      response.data.pipe(fs.createWriteStream('generated_image.jpg'));
      console.log('Immagine generata scaricata correttamente.');
    })
    .catch(error => {
      console.error('Errore durante la richiesta dell\'immagine generata:', error);
    });
  };

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

const output = replicate.run(
    "lambdal/text-to-pokemon:ff6cc781634191dd3c49097a615d2fc01b0a8aae31c448e55039a04dcbf36bba",
    {
      input: {
        prompt: "cat"
      }
    }
  );
  console.log(output);

app.set('view engine', 'ejs');

app.get("/", (req,res) =>{
    console.log("miaos")
    res.render("index")

})

// Avvia il server che ascolta sulla porta specificata
app.listen(port, () => {
    console.log(`Il server è in ascolto sulla porta ${port}`);

    console.log(output)
      
});

setInterval(() => {
    // Blocco di codice da eseguire ogni 3 secondi
    // Altre azioni da eseguire..
  //  output.then(urls => {
  //      const imageUrl = urls[0];
  //      ottieniContenutoImmagine(imageUrl) 
  //    });
  save_images("miao")
  console.log("working");
  }, 3000);

  // Funzione per ottenere l'immagine dall'URL
async function ottieniContenutoImmagine(imageUrl) {
    try {
        // Esegui la richiesta HTTP per ottenere i dati dell'immagine
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Ottieni i dati binari dell'immagine
        const imageData = Buffer.from(response.data, 'binary');

        // Puoi ora manipolare o salvare l'immagine come preferisci
        // Per esempio, salvare l'immagine su disco
        fs.writeFileSync('immagine_salvata.jpg', imageData);

        console.log('L\'immagine è stata ottenuta con successo e salvata su disco.');
    } catch (error) {
        console.error('Errore durante l\'ottenimento dell\'immagine:', error.message);
    }
}

async function ottieniContenutoImmagine(imageUrl) {
  try {
      // Esegui la richiesta HTTP per ottenere i dati dell'immagine
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      // Ottieni i dati binari dell'immagine
      const imageData = Buffer.from(response.data, 'binary');

      // Puoi ora manipolare o salvare l'immagine come preferisci
      // Per esempio, salvare l'immagine su disco
      fs.writeFileSync('immagine_salvata.jpg', imageData);

      console.log('L\'immagine è stata ottenuta con successo e salvata su disco.');
  } catch (error) {
      console.error('Errore durante l\'ottenimento dell\'immagine:', error.message);
  }
}
