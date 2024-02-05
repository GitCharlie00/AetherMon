$(document).ready(async function() {
    const monsterGenerationURL = "http://localhost:5000";
    const web3 = new Web3(window.ethereum || "http://localhost:7545");
    const gameContractData = await fetch("/GameContractJSON");
    const gameContractJSON = await gameContractData.json();
    const gameContractAddress = gameContractJSON.networks['5777'].address;
    const gameContractABI=  gameContractJSON.abi;
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
            console.log("Non hai abbastanza AEC");  
            const element2 = document.getElementById('error_overlay');
            element2.style.visibility = 'visible';    //TODO: Mostrarlo a schermo
            return;
        }
        popup_loading()
        back_on_transaction();                  //Hide the modal
        console.log("Starting monster creation");
        //Request the local server to create a monster image
        axios.get(monsterGenerationURL, { responseType: 'arraybuffer' })
            .then(async (response) => {
                // Elabora la risposta ricevuta dal backend
                const filename = response.headers.filename;
                if(filename != " "){
                    console.log("Obtained image : "+filename);
                    console.log(typeof filename);
                    console.log(response.data)
                    const element3 = document.getElementById('popup_new_monster_img');
                    element3.src = response.data;   
                    //Upload to IPFS
                    const pinataImgURL = await uploadFileIPFS(response.data,filename);                
                    console.log("Image saved on IPFS Pinata"); 
                    //Save on blockchain
                    gameContract.methods.buyNewMonster(pinataImgURL).send({from:currentAccount}).then(result =>{
                        if(result){
                            hatch_animation();
                            console.log("Mostro creato e salvato sulla blockchain");
                            balance(currentAccount); 
                        }
                    });
                }
                else{
                    const element2 = document.getElementById('error_overlay');
                    element2.style.visibility = 'visible';
                    const element3 = document.getElementById('loading_overlay');
                    element3.style.visibility = 'hidden';
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

function popup_loading(){
    const element1 = document.getElementById('loading_overlay');
    element1.style.visibility = 'visible';
    
    
}

function hatch_animation() {
    console.log("miaos");
    const element = document.getElementById('spark_container');
    element.style.visibility = 'visible';
    var image = document.getElementById('spark_img');
    image.classList.toggle('is-zoomed');

    setTimeout(function() {
        image.classList.add('fade-in');
        const element2 = document.getElementById('loading_overlay');
        new_monster_pop();
        element2.style.visibility = 'hidden';
        setTimeout(function() {
            element.style.visibility = 'hidden';
        }, 1000);
    }, 2000);
    
    
}

function new_monster_pop (){
    const element = document.getElementById('new_monster_overlay');
    element.style.visibility = 'visible';
    element.classList.toggle('fade-in');
}

function error_back() {
    const element = document.getElementById('error_overlay');
    element.style.visibility = 'hidden';
}

function new_monster_back() {
    console.log("miaos")
    const element = document.getElementById('new_monster_overlay');
    element.style.visibility = 'hidden';
}