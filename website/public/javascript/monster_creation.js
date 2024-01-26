function go_back(){
    console.log("go back");
}

function popup_hatch_confirm(){
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'visible';
}

function back_on_transaction(){
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'hidden';
}

function create_monster(){
    console.log("lets create");
    axios.get('/api/dati')
        .then(response => {
            // Elabora la risposta ricevuta dal backend
            console.log(response.data);
    })
    .catch(error => {
        // Gestisci eventuali errori durante la richiesta
        console.error(error);
    });
}