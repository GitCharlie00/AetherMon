document.addEventListener("DOMContentLoaded", function() {
  // Seleziona gli elementi del DOM
  const playerHealthBar = document.getElementById("me-health");
  const opponentHealthBar = document.getElementById("opponent-health");
  const playerName = document.getElementById("me-name").innerText;
  const opponentName = document.getElementById("opponent-name").innerText;
  const playerLevel = document.getElementById("me-level");
  const opponentLevel = document.getElementById("opponent-level");
  const move1Button = document.getElementById("move-1");
  const move2Button = document.getElementById("move-2");
  const reply_button = document.getElementById('popup_accept_button_inner');

  team_url_img = "./images/battle/pikachu.png"
  enemy_url_img = "./images/battle/charmander.png"

  document.body.style.background = "url('./images/battle/bg.png') center/contain no-repeat";

  const enemy_img = document.getElementById("opponent");

  enemy_img.src = enemy_url_img;

  const playerPokemon = load_monster()

  const opponentPokemon = load_enemy_monster()


  const applyAttackAnimation = (pokemonImage) => {
    pokemonImage.classList.add("attack-animation");
  };

  const removeAttackAnimation = (pokemonImage) => {
    pokemonImage.classList.remove("attack-animation");
  };


  // Funzione per gestire l'attacco del giocatore
  const playerAttack = () => {
    console.log(opponentPokemon.currentHealth )
    const damage = Math.floor(Math.random() * playerPokemon.attack) + 1;
    opponentPokemon.currentHealth -= damage;
    console.log(opponentPokemon)
    console.log(opponentPokemon.currentHealth )

    if (opponentPokemon.currentHealth <= 0) {
        opponentPokemon.currentHealth = 0;
        popup_restart(false);
    }

    updateHealthBars();
    // Applica l'animazione al Pokémon attaccante (utente)
    const playerPokemonImage = document.querySelector("#me");
    applyAttackAnimation(playerPokemonImage);

    // Dopo l'attacco del giocatore, attendi 1 secondo prima di far attaccare il Pokémon avversario
    setTimeout(() => {
        // Rimuovi l'animazione dal Pokémon attaccante (utente)
        removeAttackAnimation(playerPokemonImage);
        opponentAttack(); // Il Pokémon avversario risponde con un attacco casuale
    }, 1000);
};

  // Funzione per gestire l'attacco del Pokémon avversario
  const opponentAttack = () => {
    const damage = Math.floor(Math.random() * opponentPokemon.attack) + 1;
    playerPokemon.currentHealth -= damage;

    if (playerPokemon.currentHealth <= 0) {
        playerPokemon.currentHealth = 0;
        popup_restart(false)
        
    }
    updateHealthBars();

    // Applica l'animazione al Pokémon difensore (utente)
    const opponentPokemonImage = document.querySelector("#opponent");
    applyAttackAnimation(opponentPokemonImage);
    
    // Rimuovi l'animazione dal Pokémon difensore (utente) dopo l'attacco del Pokémon avversario
    setTimeout(() => {
        removeAttackAnimation(opponentPokemonImage);
    }, 1000);
};
  
  // Funzione per aggiornare le barre della salute
  const updateHealthBars = () => {     
      playerHealthBar.style.width = `${(playerPokemon.currentHealth / playerPokemon.maxHealth) * 100}%`;
      opponentHealthBar.style.width = `${(opponentPokemon.currentHealth / opponentPokemon.maxHealth) * 100}%`;
  };

  const replay = () => {
    const element = document.getElementById('restart_overlay');
    element.style.visibility = 'hidden';
    resetGame();
};

  // Funzione per reimpostare il gioco
  const resetGame = () => {
      playerPokemon.currentHealth = playerPokemon.maxHealth;
      opponentPokemon.currentHealth = opponentPokemon.maxHealth;
      updateHealthBars();
  };

  // Aggiungi gli eventi di click per i pulsanti delle mosse
  move1Button.addEventListener("click", playerAttack);
  move2Button.addEventListener("click", playerAttack);
  reply_button.addEventListener("click", replay);

  // Inizializza le barre della salute
  updateHealthBars();

});

function load_monster()
{

  var queryString = window.location.search;
  var searchParams = new URLSearchParams(queryString);
  var url = searchParams.get("monsterURL");
  const team_img = document.getElementById("me");
  team_img.src = url;

  var attack = searchParams.get("monsterATTACK");
  var speed = searchParams.get("monsterSPEED");
  var defense = searchParams.get("monsterDEFENSE");
  var maxHealth = searchParams.get("monsterHP");

  const monster = {
    name: "zebra",
    level: 42,
    maxHealth: maxHealth,
    currentHealth: maxHealth,
    attack: attack,
    defense: defense,
    speed: speed
};

return monster

}

function load_enemy_monster()
{
  var queryString = window.location.search;
  var searchParams = new URLSearchParams(queryString);
  var difficulty = searchParams.get("missionDifficultyNumber");
  var dif_text = "Aasy";

  console.log("difficoltaaaaaaaaaaaaaas", difficulty)

  let name= "SHAONE";
  let level= 42;
  let maxHealth= 6;
  let attack= 3;
  let defense= 3;
  let speed= 2;
  let boss_url_img = "./images/battle/low_boss.png"
  
if (difficulty == 1) {
    name= "Block and Chain";
    level= 42;
    maxHealth= 7;
    attack= 6;
    defense= 6;
    speed= 6;
    boss_url_img = "./images/battle/mid_boss.png";
    dif_text = "Medium";
} else if ( difficulty == 0) {
    name= "Di Ciccio";
    level= 42;
    maxHealth= 16;
    attack= 10;
    defense= 10;
    speed= 10;
    boss_url_img = "./images/battle/hard_boss.png"
    dif_text = "Ciccio Difficulty";
}

const monster = {
  name: name,
  level: level,
  maxHealth: maxHealth,
  currentHealth: maxHealth,
  attack: attack,
  defense: defense,
  speed: speed
};

let element= document.getElementById("opponent-name");
element.textContent = name;

element= document.getElementById("opponent-level");
element.textContent = dif_text;

var queryString = window.location.search;
var searchParams = new URLSearchParams(queryString);
const opponent_img = document.getElementById("opponent");
opponent_img.src = boss_url_img;

return monster;

}

function popup_restart(win)
{
  const element1 = document.getElementById('popup_restart_message');
  if (win) {
    element1.textContent ="You WON! Want to retry?"
  } else {
    element1.textContent ="Your Aethermon is fainted! You Loose"
  }
  const element = document.getElementById('restart_overlay');
  element.style.visibility = 'visible';
}

function go_back()
{
  window.location.href = "/missions";
}