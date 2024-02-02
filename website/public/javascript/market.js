$(document).ready(async function(){
  //Initialization web3 and contract constants
  const web3 = new Web3(window.ethereum || "http://localhost:7545");

  const gameContractData = await fetch("/GameContractJSON");
  const gameContractJSON = await gameContractData.json();

  const pinataGatewayToken = "G83CiLljLnCGugjxSAoseEaAMBUeOMdRy8o4hUxhi7bVYNqOxDt0G-k8Y9TuBW31";

  const monsterContractData = await fetch("/AEMonsterNFTJSON");
  const monsterContracJSON = await monsterContractData.json();

  const gameContractAddress = gameContractJSON.networks['5777'].address;
  const gameContractABI=  gameContractJSON.abi;

  
  const monsterContractABI = monsterContracJSON.abi;

  const gameContract = new web3.eth.Contract(gameContractABI,gameContractAddress); 

  //Load the monsterContract address
  var monsterContractAddress = await getMonsterContractAddress();

  const monsterContract = new web3.eth.Contract(monsterContractABI,monsterContractAddress); 

  var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });; 
  var currentAccount = accounts[0];

  await loadMarketList();                          //Load the list of selling monster
  await getMonstersOf(currentAccount);            //Laod the monsters of the current account

  async function loadMarketList(){
    gameContract.methods.getOnSaleMonsters().call().then(onSaleMonsters=>{


      for(let i = 0;i<onSaleMonsters.length;i++){

        var monsterId = onSaleMonsters[i].tokenId;
        console.log(monsterId);

        monsterContract.methods.getTokenURI(monsterId).call().then(monsterURI=>{  //Retrive the IPFS url to the image
          var imageURL = monsterURI+"?pinataGatewayToken="+pinataGatewayToken;
          var isMine = onSaleMonsters[i].seller.toLowerCase() === currentAccount.toLowerCase(); //Chek if the on sale monster is of the currentUser
          if(isMine){
            var $productItem = $(
              '<div class="product" id="'+onSaleMonsters[i].tokenId+'">'+
              '<img src="'+imageURL+'">'+
              '<p>Price: '+onSaleMonsters[i].price+'AEC</p>'+
              '<button id="remove">Remove</button>'+
              '<button id="change">Change Price</button>'
              );
          }
          else{
            var $productItem = $(               
              '<div class="product" id="'+onSaleMonsters[i].tokenId+'">'+
                '<img src="'+imageURL+'">'+
                '<p>Price: '+onSaleMonsters[i].price+'AEC</p>'+
              '<\div>'
            );
          }

          //Append the selling monster to the visible list
          var $productsList = $("#products");
          //If its mine show at the top of the list
          if(isMine){
            $productsList.prepend($productItem);
            $removeBtn = $productItem.find("#remove");
            //The function will remove the item from selling list
            $removeBtn.click(()=>{
              removeFromSelling(onSaleMonsters[i].tokenId);
            });

            $changeBtn = $productItem.find("#change");
            $changeBtn.click(()=>{
              changePrice(onSaleMonsters[i].tokenId);
            });

          }
          else{
            $productsList.append($productItem);
           // $productsList.click(()=>{
             // showProductDetails("","",onSaleMonsters[i].price,imageURL,isMine);
            //});
          } 

        });
      }
    });
  }

  
  async function getMonstersOf(currentAccount){
    monsterContract.methods.getMonstersOwnedBy(currentAccount).call().then(monsters=>{
      if(monsters.length != 0){
        monsterContract.methods.getMonstersURIOwnedBy(currentAccount).call().then(monstersURI=>{

          var $myAEthermons = $("#myAEthermons");

          for(let i =0;i<monsters.length;i++){
            var imageURL = monstersURI[i]+"?pinataGatewayToken="+pinataGatewayToken;
            
            var $myMonsterItem = $(               
              '<div class="product">'+
                '<img src="'+imageURL+'">'+
                '<button> Sell </button>'+
                '<label for="monsterPrice">Insert a price:</label>'+
                '<input type="number" id="monsterPrice'+monsters[i].monsterId+'" name="monsterPrice" pattern="\d+" title="Set a price (AEC)" required></input>'+
              '<\div>'
            );
            $myAEthermons.append($myMonsterItem);

            //Attach the sell function to the button
            var $sellButton = $myMonsterItem.find(":button");
            $sellButton.click(()=>{
              sell(monsters[i].monsterId);
            });
          }

        });
      }
    });
  }


  //Function to sell the monster
  async function sell(monsterId){
    //Retrive the selling price
    price = parseInt($("#monsterPrice"+monsterId).val());
    if(typeof price === "number" && price > 0){
      gameContract.methods.putOnSale(monsterId,price).send({from:currentAccount}).then(result=>{
        if(result){
          console.log("Mostro messo in vendita con successo");
        }
      });
    }
  }

  async function removeFromSelling(monsterId){
    console.log(monsterId);
    gameContract.methods.leaveFromSale(monsterId).send({from:currentAccount,gas: '1000000'}).then(result=>{
      console.log("Monster removed from sale");
    });
  }


  async function changePrice(monsterid){

  }

  // Funzione per mostrare la modal con le caratteristiche del prodotto
  function showProductDetails(title,description,price,imagePath,isMine){
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalImage').src=imagePath;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('modalPrice').innerText = price;
    
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }


  //Function to retrive the AEMonsterNFT address from the GameContract 
  async function getMonsterContractAddress(){
    return new Promise((resolve, reject) => {
      gameContract.methods.AEMonsterContract().call()
        .then(address => {
          resolve(address);
        })
        .catch(error => {
          console.log(error);
        });
     });
  }

});






// Funzione per chiudere la finestra modal
function closeModal() {
  var modal = document.getElementById('myModal');
  var modal2=document.getElementById('confirmModal');
  modal.style.display = 'none';
  modal2.style.display = 'none';
}

//Funzione per chiudere modal vendite  
function closesellModal(){
  var modal3=document.getElementById('sellModal');
  modal3.style.display = 'none';
}

// Funzione chiamata quando viene cliccato il pulsante "Buy"
function sureToBuy() {
  var modal = document.getElementById('confirmModal');
  modal.style.display = 'block';
  }

//Funzione che finalizza l'acquisto 
function buy(){
}

// Funzione chiamata quando viene cliccato il pulsante "I want to sell"
function sellWind(){
  var modal = document.getElementById('sellModal');
  modal.style.display = 'block';
}

