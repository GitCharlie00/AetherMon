from flask import Flask, jsonify, request, send_file
import torch
from PIL import Image
from diffusers import StableDiffusionPipeline
from torch import autocast
from PIL import Image

scale = 10
n_samples = 1

# Inizializza il modello di generazione delle immagini
def initialize_model():
    pipe = StableDiffusionPipeline.from_pretrained("lambdalabs/sd-pokemon-diffusers", torch_dtype=torch.float16)
    pipe = pipe.to("cuda")

    # Sometimes the nsfw checker is confused by the Pokémon images, you can disable
    # it at your own risk here
    disable_safety = False

    if disable_safety:
        def null_safety(images, **kwargs):
            return images, False
        pipe.safety_checker = null_safety
    return pipe

# Funzione per generare l'immagine
def generate_image(model, prompt):
    with autocast("cuda"):
        images = model(n_samples*[prompt], guidance_scale=scale).images

    for idx, im in enumerate(images):
        im.save(f"{idx:06}.png")
    return images

app = Flask(__name__)
model = initialize_model() # Inizializza il modello all'avvio dell'applicazione

@app.route('/api/image', methods=['GET'])
def get_generated_image():
    image = generate_image(model, "soul dog")  # Genera l'immagine utilizzando il modello
    image_path = "generated_image.jpg"  # Percorso per salvare temporaneamente l'immagine

    # Salva l'immagine generata su disco
    image.save(image_path)

    # Restituisci l'immagine come risposta alla chiamata GET
    return send_file(image_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run()