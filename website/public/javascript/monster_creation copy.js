function go_back(){
    window.location = "/homepage";
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
    popup_loading()
    back_on_transaction()
    console.log("lets create");
    setTimeout(function() {
        axios.get('/api/dati')
        .then(response => {
            console.log(response.data);
            hatch_animation();
    })
    .catch(error => {
        console.error(error);
        const element1 = document.getElementById('loading_overlay');
        element1.style.visibility = 'hidden';
        const element2 = document.getElementById('error_overlay');
        element2.style.visibility = 'visible';
    });
      }, 3000);
    
}

function popup_loading(){
    const element1 = document.getElementById('loading_overlay');
    element1.style.visibility = 'visible';
    
    
}

function hatch_animation() {
    console.log("miaos");
    const element = document.getElementById('spark_container');
    element.style.visibility = 'visible';
    var image = document.getElementById('spark_img');
    image.classList.toggle('is-zoomed');

    setTimeout(function() {
        image.classList.add('fade-in');
        const element2 = document.getElementById('loading_overlay');
        new_monster_pop();
        element2.style.visibility = 'hidden';
        setTimeout(function() {
            element.style.visibility = 'hidden';
        }, 1000);
    }, 2000);
    
    
}

function new_monster_pop (){
    const element = document.getElementById('new_monster_overlay');
    element.style.visibility = 'visible';
    element.classList.toggle('fade-in');
}

function error_back() {
    const element = document.getElementById('error_overlay');
    element.style.visibility = 'hidden';
}

function new_monster_back() {
    console.log("miaos")
    const element = document.getElementById('new_monster_overlay');
    element.style.visibility = 'hidden';
}