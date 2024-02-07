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

  var buyID;      //It will collects the current id of the monster the user want to buy

  const subscribeToEventNew = async()=>{
    const emitter = await gameContract.events.NewOnSale();
    return emitter;
  }

  const subscribeToEventRetired = async()=>{
    const emitter = await gameContract.events.Retired();
    return emitter;
  }

  const suscribeToEventSelled = async()=>{
    const emitter = await gameContract.events.Selled();
    return emitter;
  }

  //*-----------Load the event emitters-------------*
  var newOnSaleEmitter;
  subscribeToEventNew()
    .then(result=>{
      newOnSaleEmitter = result;
      newOnSaleEmitter.on("data",newOnSale);
    })
    .catch(error=>{
      console.log("Not able to caputere onSaleEvent: "+error);
      alert("Not able to caputere onSaleEvent: "+error);
    });

  var retiredEmitter;
  subscribeToEventRetired()
    .then(result=>{
      retiredEmitter = result;
      retiredEmitter.on("data",retired);
    })
    .catch(error=>{console.log(error)});

  var selledEmitter;
  suscribeToEventSelled()
    .then(result=>{
      selledEmitter = result;
      selledEmitter.on("data",selled);
    })
    .catch(error=>{console.log(error)});
  
  await loadMarketList();                          //Load the list of selling monster
  await getMonstersOf(currentAccount);            //Laod the monsters of the current account


  //Load all the monsters on sale
  async function loadMarketList(){
    gameContract.methods.getOnSaleMonsters().call().then(onSaleMonsters=>{

      for(let i = 0;i<onSaleMonsters.length;i++){

        var monsterId = onSaleMonsters[i].tokenId;

        monsterContract.methods.getTokenURI(monsterId).call().then(monsterURI=>{  //Retrive the IPFS url to the image
          monsterContract.methods.getMonsterFromId(monsterId).call().then(result=>{
            var imageURL = monsterURI+"?pinataGatewayToken="+pinataGatewayToken;
            var isMine = onSaleMonsters[i].seller.toLowerCase() === currentAccount.toLowerCase(); //Chek if the on sale monster is of the currentUser
            if(isMine){
              var $productItem = $(getUserProduct(imageURL,onSaleMonsters[i].tokenId,onSaleMonsters[i].price));
            }
            else{
              var $productItem = $(getProduct(imageURL,onSaleMonsters[i].tokenId,onSaleMonsters[i].price,result.HP,result.AP,result.SP,result.DP,result.level));
              //Connect the buy function 
              var $buyBtn = $productItem.find("#buy");
              $buyBtn.click(()=>{
                buyFromMarket(onSaleMonsters[i].tokenId);
              });
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

            } 
  
          });
        });
      }
    });
  }

  
  //Load the monster of the current user
  async function getMonstersOf(currentAccount){
    monsterContract.methods.getMonstersOwnedBy(currentAccount).call().then(monsters=>{
      if(monsters.length != 0){
        monsterContract.methods.getMonstersURIOwnedBy(currentAccount).call().then(monstersURI=>{

          var $myAEthermons = $("#myAEthermons");

          for(let i =0;i<monsters.length;i++){
            var imageURL = monstersURI[i]+"?pinataGatewayToken="+pinataGatewayToken;
            
            //Check if the monsters in on sale
            $monsterItem = $("#products").find("#"+monsters[i].monsterId);

            if($monsterItem.length > 0){      //If the monster is on sale, show only the possibility to remove from sale
              var priceString = $("#products").find("#"+monsters[i].monsterId).find("#price").text();  //Retrive the price of that monster

              var $myMonsterItem = $(getMyMonsterItemOnSale(imageURL,monsters[i].monsterId,priceString));

              $myAEthermons.append($myMonsterItem);

              $removeBtn = $myMonsterItem.find("#remove");
              //The function will remove the item from selling list
              $removeBtn.click(()=>{
                removeFromSelling(monsters[i].monsterId);
              });
            }

            else{        
              var $myMonsterItem = $(getMyMonsterItem(imageURL,monsters[i].monsterId));

              $myAEthermons.append($myMonsterItem);

              //Attach the sell function to the button
              var $sellButton = $myMonsterItem.find(":button");
                $sellButton.click(()=>{
                  sell(monsters[i].monsterId);
              });

            }
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
          //Remove the sell card and add the retire card of the monster
          var $item = $("#myAEthermons").find("#"+monsterId);
          var imageURL = $item.find("img").attr('src');
          $item.remove();
          var $newItem = $(getMyMonsterItemOnSale(imageURL,monsterId,"Price: "+price+"AEC"));
          $("#myAEthermons").prepend($newItem);

          
          //Add the remove function to the selling monster
          $removeBtn = $newItem.find("#remove");
          //The function will remove the item from selling list
          $removeBtn.click(()=>{
            removeFromSelling(monsterId);
          });

          console.log("Mostro messo in vendita con successo");
          const errorType='Mostro messo in vedita con successo!';
          $('#errorModalBody').text( errorType);
          $('#errorModal').modal('show');
        }
      });
    }
  }

  //Function to remove an owned selling moster from sale
  async function removeFromSelling(monsterId){
    gameContract.methods.leaveFromSale(monsterId).send({from:currentAccount,gas: '1000000'}).then(result=>{
      console.log("Monster removed from sale");
      const errorType='Monster removed from sale';
          $('#errorModalBody').text( errorType);
          $('#errorModal').modal('show');
    });
  }

  //Set the monster to buy after confirmation
  async function buyFromMarket(monsterId){
    $confirmModal = $("#confirmModal");
    buyID = monsterId;
    $confirmModal.modal('show');
  }

  //Buy the monsterID selected after confirm
  $("#sureBtn").click(()=>{
    gameContract.methods.buyOnSaleMonster(buyID).send({from:currentAccount}).then(result=>{
      if(result){
        $("#confirmModal").modal("hide");
        console.log("Mostro acquistato con successo");
        const errorType='Mostro acquistato con successo';
          $('#errorModalBody').text( errorType);
          $('#errorModal').modal('show');
      }
    });
    
  });

  //Function to change the price of an owned selling monster
  async function changePrice(monsterId){
    var newPrice = parseInt($("#changeModal"+monsterId).find("#newPrice").val());
    if(typeof newPrice === "number" && newPrice > 0){
      //Call the SC
      gameContract.methods.changePrince(monsterId,newPrice).send({from:currentAccount}).then(result=>{

        //Close the modal
        $('#changeModal'+monsterId).find("#newPrice").css('border', '1px solid black');
        $("#changeModal"+monsterId).modal('hide');
      });
    }

    else{
      //If there is some error change the color of the input box to red
      ($('#changeModal'+monsterId).find("#newPrice")).css('border', '1px solid red');
    }


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


  //*---------- Function that handles market events -------------*/

  //Function called each time a monster is put on sale
  function newOnSale(event){
    var newPrice = event.returnValues.price;
    var monsterId = event.returnValues.tokenId;

    //Verify if the product is already there
    $product = $("#products").find("#"+monsterId);

    //It exists (so only the price was changed)
    if($product.length > 0){
      $product.find("#price").text(newPrice+" AEC");
    }
    //It not
    else{
      monsterContract.methods.getTokenURI(monsterId).call().then(monsterURI=>{
        var imageURL = monsterURI+"?pinataGatewayToken="+pinataGatewayToken;
        var $productsList = $("#products");

        if($("#myAEthermons").find("#"+monsterId).length > 0){    //The new on sale monster is of the current user, so it must have the remove and chg btns
          var $productItem = $(getUserProduct(imageURL,monsterId,newPrice));

            $productsList.prepend($productItem);
            $removeBtn = $productItem.find("#remove");

            //The function will remove the item from selling list
            $removeBtn.click(()=>{
              removeFromSelling(monsterId);
            });

            $changeBtn = $productItem.find("#change");
            $changeBtn.click(()=>{
              changePrice(monsterId);
            });
        }

        else{
          monsterContract.methods.getMonsterFromId(monsterId).call().then(result=>{
            var $productItem = $(getProduct(imageURL,onSaleMonsters[i].tokenId,onSaleMonsters[i].price,result.HP,result.AP,result.SP,result.DP,result.level));
            var $buyBtn = $productItem.find("#buy");
            $buyBtn.click(()=>{
              buyFromMarket(onSaleMonsters[i].tokenId);
            });
            $productsList.append($productItem);
          });

        }

      });

    }
  }


  //Function called each time a monster is retired from the market
  function retired(event){
    var monsterId = event.returnValues.tokenId;

    //Remove the corresponding card from the displayed list
    $("#products").find("#"+monsterId).remove();

    //If the retired monster was owned by the current user, the card in the "sell section" must change
    var $myAEthermons = $("#myAEthermons");
    var $item = $myAEthermons.find("#"+monsterId);

    if($item.length > 0) { //Item found
      var imageURL = $item.find("img").attr('src');
      $item.remove();
      var $newItem = $(getMyMonsterItem(imageURL,monsterId));
      
      $myAEthermons.append($newItem);

      //Attach the sell function to the button
      var $sellButton = $newItem.find(":button");
        $sellButton.click(()=>{
          sell(monsterId);
      });

    }
  }

  //Remove the displayed item when sold
  
  function selled(event){
    
    var monsterId = event.returnValues.tokenId;
    var buyer = event.returnValues.buyer;
    //Remove the item from the displayed list
    var $item = $("#products").find("#"+monsterId);
    $item.remove();
    
    //If the item is of the current user, remove it 
    var $userItem = $("#myAEthermons").find("#"+monsterId);
    if($userItem.length > 0) $userItem.remove();

    if(currentAccount.toLowerCase() === buyer.toLowerCase()){   //The current account is the buyer, so the new item must be load into his space
      monsterContract.methods.getTokenURI(monsterId).call().then(monstersURI=>{
        var imageURL = monstersURI[i]+"?pinataGatewayToken="+pinataGatewayToken;
        var $newItem = $(getMyMonsterItem(imageURL,monsterId));

        var $myAEthermons = $("#myAEthermons");
        $myAEthermons.append($newItem);

        //Attach the sell function to the button
        var $sellButton = $newItem.find(":button");
          $sellButton.click(()=>{
            sell(monsterId);
        });

      });
      
    } 
  }
  


  //*------------Utilities-------------*

  function getUserProduct(imageURL,monsterId,newPrice){
    return ''+
    '<div class="product" id="'+monsterId+'">'+
    '<img src="'+imageURL+'">'+
    '<p id="price">Price: '+newPrice+'AEC</p>'+
    '<button id="remove">Remove</button>'+
    '<button data-bs-toggle="modal" data-bs-target="#changeModal'+monsterId+'">Change Price</button>'+
  '</div>'+
  '<div class="modal fade" id="changeModal'+monsterId+'" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'+
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h1 class="modal-title fs-5" id="exampleModalLabel">Change Price</h1>'+
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
      '</div>'+
      '<div class="modal-body">'+
        '<div class="input-group mb-3">'+
        '<span class="input-group-text">AEC</span>'+
        '<input type="number" class="form-control" required id="newPrice">'+
      '</div>'+
      '</div>'+
      '<div class="modal-footer">'+
      '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'+
      '<button id="change" type="button" class="btn btn-primary">Save changes</button>'+
    '</div>'+
    '</div>'+
  '</div>'+
  '</div>';
  }


  function getProduct(imageURL,monsterId,price,hp,ap,sp,dp,level){
    return ''+
    '<div class="product" id="'+monsterId+'">'+
    '<img src="'+imageURL+'">'+
    '<p id="price">Price: '+price+'AEC</p>'+
    '<p id="hp">HP: '+hp+'</p>'+
    '<p id="ap">AP: '+ap+'</p>'+
    '<p id="sp">SP: '+sp+'</p>'+
    '<p id="dp">DP: '+dp+'</p>'+
    '<p id="level">Level: '+level+'</p>'+
    '<button id="buy">Buy</button>'+
  '<\div>';
  }

  function getMyMonsterItemOnSale(imageURL,monsterId,priceString){
    return ''+
    '<div class="product" id="'+monsterId+'">'+
    '<img src="'+imageURL+'">'+
    '<p id="price">'+priceString+'</p>'+
    '<button id="remove">Remove</button>'+
  '<\div>';
  }

  function getMyMonsterItem(imageURL,monsterId){
    return ''+
    '<div class="product" id="'+monsterId+'">'+
      '<img src="'+imageURL+'">'+
      '<button> Sell </button>'+
      '<label for="monsterPrice">Insert a price:</label>'+
      '<input type="number" id="monsterPrice'+monsterId+'" name="monsterPrice" pattern="\d+" title="Set a price (AEC)" required></input>'+
    '<\div>';
  }
});
