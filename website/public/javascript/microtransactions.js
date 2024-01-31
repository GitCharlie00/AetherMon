const web3 = new Web3(window.ethereum ||"http://localhost:7545");
const gameContractABI= [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "NewOnSale",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "Retired",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      }
    ],
    "name": "Selled",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "AECoinContractAddress",
    "outputs": [
      {
        "internalType": "contract AECoinFT",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "AEMonsterContract",
    "outputs": [
      {
        "internalType": "contract AEMonsterNFT",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "buyOnSaleMonster",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "changePrince",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "leaveFromSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "putOnSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sellingMap",
    "outputs": [
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "numberOfCoins",
        "type": "uint256"
      }
    ],
    "name": "purchaseGameCoins",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "coinBalanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "buyNewMonster",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const gameContractAddress = "0xAdFEd37eE4ea9FE59690e1D51863Be887acaC993";
const gameContract = new web3.eth.Contract(gameContractABI,gameContractAddress); 


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
    microtransaction_list.push(new Microtransaction(0.005,100,0));
    microtransaction_list.push(new Microtransaction(0.010,200,1));
    microtransaction_list.push(new Microtransaction(0.025,500,2));
    microtransaction_list.push(new Microtransaction(0.05,1000,3));
    load_microtransactions_cards();
    
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
          $("#balance").text(result+ " AEC");
      });
}