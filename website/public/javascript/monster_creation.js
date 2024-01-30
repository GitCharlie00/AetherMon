$(document).ready(async function() {
    const monsterGenerationURL = "http://localhost:5000";
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
    const gameContractAddress = "0x3CC2b9F2843c4f21DB12C85fcB311B7919d3474D"; 
    const web3 = new Web3(window.ethereum || "http://localhost:7545");
    const gameContract = new web3.eth.Contract(gameContractABI,gameContractAddress);
    var userBalance;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];
    $createMonsterBtn = $("#popup_accept_button_inner");

    $createMonsterBtn.on("click",create_monster);

    balance(currentAccount);          //Retrive the balance (in AECoins) of the connected account

    //Retrive the AECoin of the account
    async function balance(currentAccount){
        gameContract.methods.coinBalanceOf(currentAccount).call().then((result)=>{
              $("#balance").text(result+ " AEC");
              userBalance = result;
         });
    }

    //Create a new monster, save the image in the IPFS and the link on blockchain
    async function create_monster(){
        if(userBalance < 100){
            console.log("Non hai abbastanza AEC");      //TODO: Mostrarlo a schermo
            return;
        }
        back_on_transaction();                  //Hide the modal
        console.log("Starting monster creation");
        //Request the local server to create a monster image
        axios.get(monsterGenerationURL, { responseType: 'arraybuffer' })
            .then(async (response) => {
                // Elabora la risposta ricevuta dal backend
                const filename = response.headers.filename;
                if(filename != " "){
                    console.log("Obtained image : "+filename);
                    //Upload to IPFS
                    const pinataImgURL = await uploadFileIPFS(response.data,filename);                
                    console.log("Image saved on IPFS Pinata"); 
                    //Save on blockchain
                    gameContract.methods.buyNewMonster(pinataImgURL).send({from:currentAccount}).then(result =>{
                        if(result){
                            console.log("Mostro creato e salvato sulla blockchain");
                            balance(currentAccount); 
                        }
                    });
                }
                else{
                    console.log("Errore generazione mostro");
                }
                
        })
        .catch(error => {
            // Gestisci eventuali errori durante la richiesta
            console.error(error);
        });
    }




    //!Da rimuovere
    const pinataApiKey = "3c6fb7a964bfd8ce82ff"
    const pinataSecret = "c4b81195a80aa3d9d6e6fd061fbc281c1d2fa3f5f9780f91edcb7874881c7236"


    //?The functionalities needed to interact with IPFS
    async function uploadFileIPFS(imageData,filename){
        //const imageBuffer = new Uint8Array(imageData);

        const fileBuffer = imageData;
        const fileBlob = new Blob([fileBuffer]);
        const fileName = filename;
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
            
            const pinataImgURL = "https://fuchsia-total-mosquito-825.mypinata.cloud/ipfs/"+data.IpfsHash;
            return pinataImgURL;
            } catch (error) {
            console.log(error);
            }
        };
});


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