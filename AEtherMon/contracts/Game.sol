// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

import "./AEMarket.sol";            //NOTE: This contract also deploys the AECoinFT contract and the AEMonsterNFT contract

contract GameContract is AEMarket{
    //*--------------State variables--------------

    //The owner of the contract
    address public owner;

    //*The constructor define the account to interact with
    constructor() AEMarket(){
        owner = msg.sender;
    }

    //*--------------Modifiers--------------

    //It verifies if a player has enough AECoin to buy a new AEthermon
    modifier canBuyNewMonster(address player){
        require(AECoinContractAddress.balanceOf(player) >= 100,"Not enough AECoins");
        _;
    }

    //*--------------Main functionalities--------------

    //NOTE : Ricorda che in Ethereum viene utilizzato il Wei ( 1eth = 1e18wei = 10^18wei)
    //NOTE : Ricorda che msg.value è espresso in wei
    //Funzione che consente all'utente di acquistare monente di gioco (100AEC = 0.005 ETH) => 1Coin = (0.005 / 100 eth) = 0.00005 eth
    function purchaseGameCoins(uint256 numberOfCoins) public payable{
        //Calcola il costo in eth delle monete richieste
        uint256 costInEth = (numberOfCoins * 5e13); 

        //Verifica che l'importo inviato sia sufficente
        require(msg.value >= costInEth, "Insufficient ETH sent");

        AECoinContractAddress.purchaseCoins(msg.sender, numberOfCoins);

        //Invia i guadagni al proprietario del contratto
        payable(owner).transfer(msg.value);                     //*Se metti più soldi li perdi :)
    }


    //*Retrive the number of coins of a player
    function coinBalanceOf(address player) public view returns (uint256){
        return AECoinContractAddress.balanceOf(player);
    }


    //*Purchase a new monster function      //NOTE: A new monster costs 100 AECoin
    function buyNewMonster(string calldata tokenURI) canBuyNewMonster(msg.sender) external returns(uint256){
        uint256 monsterId = AEMonsterContract.buyMonster(msg.sender,tokenURI);
        AECoinContractAddress.burnFromGame(msg.sender, 100);
        return monsterId;   
    }


    //*Destroy all 
    function destroy() public{
        require(msg.sender == owner, "Only the owner of the contract can call this function");
        AECoinContractAddress.destroy();
        AEMonsterContract.destroy();
        selfdestruct(payable(owner));
    }
    
}