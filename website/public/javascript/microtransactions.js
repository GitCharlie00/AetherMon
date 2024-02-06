if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
    console.log('Metamask installed');
  } else {
    console.log('Metamask not installed');
    window.location.href = "/";
  }

const web3 = new Web3(window.ethereum ||"http://localhost:7545");

var gameContractData;
var gameContractJSON;

var gameContractAddress;
var gameContractABI;

var gameContract; 


class Microtransaction {
    constructor(money, aethercoin, type) {
        this.money = money;
        this.aethercoin = aethercoin;
        this.type = type;
    }
}

microtransaction_list = [];
var choosenMicro;

var currentAccount;


document.addEventListener('DOMContentLoaded', async function() {
    //Load the possible choices
    microtransaction_list.push(new Microtransaction(0.005,100,0));
    microtransaction_list.push(new Microtransaction(0.010,200,1));
    microtransaction_list.push(new Microtransaction(0.025,500,2));
    microtransaction_list.push(new Microtransaction(0.05,1000,3));
    load_microtransactions_cards();
    
    //Load the data to interact with the contract
    gameContractData = await fetch("/GameContractJSON");
    gameContractJSON = await gameContractData.json();

    gameContractAddress = gameContractJSON.networks['5777'].address;
    gameContractABI=  gameContractJSON.abi;

    gameContract = new web3.eth.Contract(gameContractABI,gameContractAddress); 

    //Load the user data
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];
    await balance(currentAccount);


});

function load_microtransactions_cards() {

    const popup_monster_list = document.getElementById('micro_cards_list');
    for (let i = 0; i < microtransaction_list.length; i++) {
        let new_id = 'transaction_card'+i;
        fetch('html/microtransactions_card.html')
        .then(response => response.text())
        .then(html => {
                const newString = 'class="micro_card" ' + 'id="' +new_id +'"';
                html = html.replace('class="micro_card"', newString);
                popup_monster_list.insertAdjacentHTML('beforeend', html)
    })
    .then(function() {

        let micro_card= document.getElementById(new_id);
        var micro_card_money = micro_card.querySelector('.micro_card_down');
        micro_card_money.textContent=microtransaction_list[i].money + "ether";

        var micro_card_aethercoin = micro_card.querySelector('.micro_card_athercoin');
        micro_card_aethercoin.textContent=microtransaction_list[i].aethercoin + "ÆC";

        var micro_card_image = micro_card.querySelector('.micro_card_image');
        micro_card_image.src=microtransaction_type_image(microtransaction_list[i].type);

        var micro_card_inner = micro_card.querySelector('.micro_card_inner');
        micro_card_inner.onclick = function() {
            open_accept_transaction(i);
        };

    })
    .catch(error => console.error(error));
}
}

function microtransaction_type_image(index){
    url_image = "images/microtransactions/emerald.png"

    switch (index) {
        case 0:
          url_image = "images/microtransactions/emerald.png"
          break;
        case 1:
            url_image = "images/microtransactions/saphire.png"
          break;
        case 2:
            url_image = "images/microtransactions/ruby.png"
          break;
        case 3:
            url_image = "images/microtransactions/diamond.png"
          break;
        default:
            url_image = "images/microtransactions/emerald.png"
          break;
      }
      return url_image
}

function open_accept_transaction(index) {
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'visible';
    console.log("mission_selected "+ index);
    choosenMicro = index;
}

function back_on_transaction() {
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'hidden';
}

function go_back() {
    window.location.href = "/homepage";
}



//?NOTE: 1Coin = (0.005 / 100 eth) = 0.00005 eth
async function buyAECoin(){
    const numberOfCoins = microtransaction_list[choosenMicro].aethercoin;
    const cost = numberOfCoins * 0.00005;
    const costInWei = web3.utils.toWei(cost.toString(), 'ether');
    gameContract.methods.purchaseGameCoins(numberOfCoins).send( {from:currentAccount, value:costInWei,gas: '100000',} )
    .on("confirmation",async ()=>{                  
        console.log("Pagamento effettuato"); 
        back_on_transaction();
        balance(currentAccount);
    })
    .on("error",(error)=>{
        console.log("Errore nella transazione: ",error);
    });
}


async function balance(currentAccount){
    gameContract.methods.coinBalanceOf(currentAccount).call().then((result)=>{
          $("#balance").text(result);
      });
}