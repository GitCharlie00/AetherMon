$(document).ready(async function() {
  const web3 = new Web3(window.ethereum || "http://localhost:7545");

  //Load the data necessary to create the contract onject
  const gameContractData = await fetch("/GameContractJSON");
  const gameContractJSON = await gameContractData.json();

  const monsterContractData = await fetch("/AEMonsterNFTJSON");
  const monsterContracJSON = await monsterContractData.json();

  const gameContractAddress = gameContractJSON.networks['5777'].address;
  const gameContractABI=  gameContractJSON.abi;
  const monsterContractABI = monsterContracJSON.abi;

  const gameContract = new web3.eth.Contract(gameContractABI,gameContractAddress);

  var monsterContractAddress = await getMonsterContractAddress();
  const monsterContract = new web3.eth.Contract(monsterContractABI,monsterContractAddress); 

  const pinataGatewayToken = "G83CiLljLnCGugjxSAoseEaAMBUeOMdRy8o4hUxhi7bVYNqOxDt0G-k8Y9TuBW31";
  var currentAccount;    


  load();

  //The button to buy some AECoin
  $buySomeBtn = $("#buySomeButton");
  $buySomeBtn.on("click",()=>{
    var numberOfCoins = parseInt($("#wantedCoins").val());

    if(numberOfCoins != undefined && numberOfCoins > 0){
      buyAECoin(currentAccount,numberOfCoins);
    }
    

  });

  //Load data of the connected account in the page
  async function load(){
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];
    await balance(currentAccount);
    await getMonstersOf(currentAccount);
  } 


  //Retrive the AECoin of the account
  async function balance(currentAccount){
    gameContract.methods.coinBalanceOf(currentAccount).call().then((result)=>{
          $("#balance").text(result+ " AEC");
      });
  }


  //Used to load the monsters owned by the user and theri information
  async function getMonstersOf(currentAccount){
    monsterContract.methods.getMonstersOwnedBy(currentAccount).call().then(monsters=>{
      $("#number").text(monsters.length);       //Update the number of monsters layout
      if(monsters.length != 0){
        monsterContract.methods.getMonstersURIOwnedBy(currentAccount).call().then(monstersURI=>{   //Load URL to the images
          
          for(let i =0;i<monsters.length;i++){    //Load the monsters in the layout

            var imageURL = monstersURI[i]+"?pinataGatewayToken="+pinataGatewayToken;
            var $newDiv = $("<div class='character'><img src='"+imageURL+"' data-bs-toggle='modal' data-bs-target='#modal"+i+"'></div>");

            var $modalObject = $(
              '<div class="modal fade" id="modal'+i+'" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog">' +
                  '<div class="modal-content">' +
                    '<div class="modal-header">' +
                      '<h5 class="modal-title" >Info</h5>' +
                      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                    '</div>' +
                    '<div class="modal-body container">' +
                      '<div class="character"><img src="'+imageURL+'" alt="Immagine" class="img-fluid"></div>' +
                      '<div class="monster-data row">' +
                          '<div class="data-item col">'+
                              'HP : '+monsters[i].HP+
                          '</div>'+
                          '<div class="data-item col">'+
                              'AP : '+monsters[i].AP+
                          '</div>'+
                      '</div>'+

                      '<div class="monster-data row">' +
                        '<div class="data-item col">'+
                            'DP : '+monsters[i].DP+
                        '</div>'+
                        '<div class="data-item col">'+
                            'SP : '+monsters[i].SP+
                        '</div>'+
                      '</div>'+

                      '<div class="monster-data row">' +
                        '<div class="data-item col">'+
                            'Level : '+monsters[i].level+
                        '</div>'+
                      '</div>'+

                    '</div>' +
                    '<div class="modal-footer">' +
                      '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
            
            var $montersDiv = $("#aethermons");
            $montersDiv.append($newDiv);
            $montersDiv.append($modalObject);
            
          }

        });

      }
    });
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

