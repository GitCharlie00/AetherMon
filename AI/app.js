const express = require("express")
const app = express()
const port = 5000
const Replicate = require("replicate")
const axios = require('axios');
const fs = require('fs');
const path = require('path');

//Used for the name of the tmp images
const crypto = require('crypto');

//Needed for the api_token
require('dotenv').config()

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

//The object needed to interact with the generative AI
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});


app.set('view engine', 'ejs');

app.get("/", async (req,res) =>{
  //TODO: implementare scelta casuale del prompt : animale + descrizioneù
  var prompt = "muscolar frog controlling smoke on fire";     //! esempio da sostituire

  var output = await replicate.run(     //Make the call to the AI generative model
    "lambdal/text-to-pokemon:ff6cc781634191dd3c49097a615d2fc01b0a8aae31c448e55039a04dcbf36bba",
    {
      input:{
        prompt: prompt
      }
    }
  );
  
  //Create the image
  const imageURL = output[0];  
  
  const filename = await save_image(imageURL);     //Create the image and return the filename

  console.log(filename);
  //Send the image
   
  res.set('Content-Type', 'image/jpeg');            //Set the response type
  
  res.sendFile(filename+'.jpg', { root: path.join(__dirname) }, (err) => {
    if (err) {
      console.error('Errore nell\'invio del file:', err);
      res.status(500).send('Errore interno del server');
    }

    else{
        //Delete the image
        delete_image(filename);
    }
  });
  
});



// Avvia il server che ascolta sulla porta specificata
app.listen(port, () => {
  console.log(`Generative script listening on ${port}`);
});


//Function used to store tmp the image of the athermon 
async function save_image(imageURL) {
  //*Define a name for the tmp file
  const hash = crypto.createHash('sha256');
  hash.update(imageURL);
  const filename = hash.digest('hex');

  await createFile(filename,imageURL);

  return filename;
};


async function createFile(filename,imageURL){
  try {
    const response = await axios.get(imageURL, { responseType: 'stream' });
    const writeStream = fs.createWriteStream(filename + '.jpg');

    // Utilizza il metodo di promessa per aspettare che la pipe venga completata
    await new Promise((resolve, reject) => {
      response.data.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error('Errore durante la richiesta dell\'immagine generata:', error);
    throw error;  // Rilancia l'errore per gestirlo nell'ambito chiamante
  }
  
}
  /*
  axios.get(imageURL, { responseType: 'stream' })
  .then( (response) => {
    response.data.pipe(fs.createWriteStream(filename+'.jpg'));
  })
  .catch(error => {
    console.error('Errore durante la richiesta dell\'immagine generata:', error);
  });
}
*/



function delete_image(filename){
  fs.unlink(filename+'.jpg', (err) => {
    if (err) {
      console.error('Errore durante la cancellazione del file:', err);
      return;
    }
  });
}