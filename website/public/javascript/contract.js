$(document).ready(async function() {
  const web3 = new Web3("http://localhost:7545");
  const gameContractAddress = "0x3CC2b9F2843c4f21DB12C85fcB311B7919d3474D";
  const monsterContractAddress = "0x21e3CC1b881FA5a4A2Ba5a6b77bcB8abCd5ab5d4";
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

  const monsterContractABI= [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_gameContractAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "MetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gameContractAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
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
      "name": "monsterIdsByAddress",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
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
      "name": "monstersOwnedBy",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "monsterId",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "AP",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "DP",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "HP",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "SP",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "level",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "numMonstersOwnedBy",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
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
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
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
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "buyMonster",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferMonster",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "monsterId",
          "type": "uint256"
        }
      ],
      "name": "getMonsterFromId",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "monsterId",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "AP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "DP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "HP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "SP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "level",
              "type": "uint8"
            }
          ],
          "internalType": "struct AEMonsterNFT.AEMonster",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getMonstersOwnedBy",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "monsterId",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "AP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "DP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "HP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "SP",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "level",
              "type": "uint8"
            }
          ],
          "internalType": "struct AEMonsterNFT.AEMonster[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getMonstersURIOwnedBy",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getTokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const gameContract = new web3.eth.Contract(gameContractABI,gameContractAddress);      //The contract objects
  const monsterContract = new web3.eth.Contract(monsterContractABI,monsterContractAddress);
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

  //?NOTE: 1Coin = (0.005 / 100 eth) = 0.00005 eth
  async function buyAECoin(currentAccount,numberOfCoins){
    const cost = numberOfCoins * 0.00005;
    const costInWei = web3.utils.toWei(cost.toString(), 'ether');
    gameContract.methods.purchaseGameCoins(numberOfCoins).send( {from:currentAccount, value:costInWei,gas: '100000',} )
    .on("confirmation",async ()=>{      //TODO: implementare la giusta gestione degli errori
        console.log("Pagamento effettuato");  
        await balance(currentAccount);
    })
    .on("error",(error)=>{
        console.log("Errore nella transazione: ",error);
    });
  }


  //Used to load the monsters owned by the user and theri information
  async function getMonstersOf(currentAccount){
    monsterContract.methods.getMonstersOwnedBy(currentAccount).call().then(monsters=>{
      $("#number").text(monsters.length);       //Update the number of monsters layout
      if(monsters.length != 0){
        monstersContract.methods.getMonstersURIOwnedBy(currentAccount).call().then(monstersURI=>{   //Load URL to the images
          
          for(let i =0;i<monsters.length;i++){    //Load the monsters in the layout
            var $newDiv = $("<div class='character'><img src='"+monstersURI[i]+" data-bs-toggle='modal' data-bs-target='#modal'"+i+"></div>");
            var $modalObject = $(
              '<div class="modal fade" id="modal'+i+'" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog">' +
                  '<div class="modal-content">' +
                    '<div class="modal-header">' +
                      '<h5 class="modal-title" >Info</h5>' +
                      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                      '<img src="'+monstersURI[i]+'" alt="Immagine" class="img-fluid">' +
                      '<!-- Inserire i dati del mostro qui -->' +
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



  //!Da rimuovere
  const pinataApiKey = "3c6fb7a964bfd8ce82ff"
  const pinataSecret = "c4b81195a80aa3d9d6e6fd061fbc281c1d2fa3f5f9780f91edcb7874881c7236"


    //?The functionalities needed to interact with IPFS
  const uploadFile = async () => {

    const src = "/images/mostro1.png";

    // Utilizza Fetch per ottenere i byte dell'immagine
    const response = await fetch(src);
    const fileBuffer = await response.arrayBuffer();
    const fileBlob = new Blob([fileBuffer]);
    const fileName = "OwnerAddr+TokenID";
    const fileWithOptions = new File([fileBlob], fileName, { type: fileBlob.type });

    //const pinataMetadata = JSON.stringify({
      //owner: 'Mattia Russo',
    //});

    const formData = new FormData();

    
    formData.append("file", fileWithOptions);
    //formData.append('pinataMetadata', pinataMetadata);

    const config = {
      method: "POST",
      maxContentLength: Infinity,
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecret,
      },
      body: formData,
    };

    try {

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", config);

      const data = await response.json();

      console.log("IpfsHash: "+data.IpfsHash);
      //return data.IpfsHash as string;
      } catch (error) {
        console.log(error);
	  }
  };

});

