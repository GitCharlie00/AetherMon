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

  const playerPokemon = {
      name: playerName,
      level: playerLevel,
      maxHealth: 100,
      currentHealth: 100,
      attackPower: 20
  };

  const opponentPokemon = {
      name: opponentName,
      level: opponentLevel,
      maxHealth: 100,
      currentHealth: 100,
      attackPower: 15
  };

  const applyAttackAnimation = (pokemonImage) => {
    pokemonImage.classList.add("attack-animation");
  };

  const removeAttackAnimation = (pokemonImage) => {
    pokemonImage.classList.remove("attack-animation");
  };

  // Funzione per gestire l'attacco del giocatore
  const playerAttack = () => {
    const damage = Math.floor(Math.random() * playerPokemon.attackPower) + 1;
    opponentPokemon.currentHealth -= damage;

    if (opponentPokemon.currentHealth <= 0) {
        opponentPokemon.currentHealth = 0;
        alert(`${opponentPokemon.name} è esausto! Hai vinto!`);
        resetGame();
    }

    updateHealthBars();
    // Applica l'animazione al Pokémon attaccante (utente)
    const playerPokemonImage = document.querySelector(".me");
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
    const damage = Math.floor(Math.random() * opponentPokemon.attackPower) + 1;
    playerPokemon.currentHealth -= damage;

    if (playerPokemon.currentHealth <= 0) {
        playerPokemon.currentHealth = 0;
        alert("Il tuo Pokémon è esausto! Hai perso!");
        resetGame();
    }
    updateHealthBars();

    // Applica l'animazione al Pokémon difensore (utente)
    const opponentPokemonImage = document.querySelector(".opponent");
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

  // Funzione per reimpostare il gioco
  const resetGame = () => {
      playerPokemon.currentHealth = playerPokemon.maxHealth;
      opponentPokemon.currentHealth = opponentPokemon.maxHealth;
      updateHealthBars();
  };

  // Aggiungi gli eventi di click per i pulsanti delle mosse
  move1Button.addEventListener("click", playerAttack);
  move2Button.addEventListener("click", playerAttack);

  // Inizializza le barre della salute
  updateHealthBars();
});