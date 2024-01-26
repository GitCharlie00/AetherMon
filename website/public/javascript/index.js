//function to connect Metamask 
   async function connect(){
    if (typeof window.ethereum !== "undefined") {
      await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      window.location.href = "/homepage";
     } else {
    alert( "Please install Metamask");
    }
}


//function to load profile in the login page
async function caricaProfilo() {
  const sezioneProfilo = document.getElementById('profilo');
  sezioneProfilo.addEventListener('click', toggleMenu);

if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
     try {
          // Richiedi il consenso dell'utente
          await window.ethereum.eth_requestAccounts;

          // Ottieni l'account corrente
          const accounts = await web3.eth.getAccounts();
          //console.log(accounts[0])
          // Aggiorna il DOM con le informazioni dell'account MetaMask
          if (accounts.length > 0) {
              const indirizzo = accounts[0];
              document.getElementById('nomeAccount').textContent = `Your account is: \n ${indirizzo}`;
          }
      } catch (error) {
          console.error("Errore durante il consenso MetaMask:", error);
      }
  } else {
      console.error("MetaMask non è installato");
  }
}



//function to show the menu of the account
function toggleMenu() {
  const menuTendina = document.getElementById('menuTendina');
  menuTendina.style.display = (menuTendina.style.display === 'none') ? 'block' : 'none';

    if (menu.style.display === 'none' || menu.style.display === '') {
      // Se il menu è chiuso o nascosto, aprirlo
      menu.style.display = 'block';
    } else {
      // Se il menu è aperto, chiuderlo
      menu.style.display = 'none';
    }

}


//funtion to select an option in the menu of the account
async function selezionaOpzione(event) {
  const opzioneSelezionata =event.target.id;
  
  switch (opzioneSelezionata) {
      case 'logout':
        try {
        //window.open('index.html');
        window.location.href = "/";
        await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      } catch (error) {
          console.error('Errore durante la disconnessione:', error);
      }
      break;
      default:
          break;
  }
}


