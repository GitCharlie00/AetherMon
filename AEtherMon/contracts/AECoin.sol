// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;


import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract AECoinFT is ERC20Burnable{
    //*--------------State variables--------------
    uint8 private reward;                                       //The number of token received as reward at the end of a battle

    address public gameContractAddress;                         //The address of the contract that manages all the dapp

    //Chiamo il costruttore di ERC20 settando nome e simbolo per il token
    constructor(address _gameContractAddress) ERC20("AECoin", "AEC") {
        reward = 10;     
        gameContractAddress = _gameContractAddress;       
    }   


    //*--------------Modifiers--------------
    modifier onlyGameContract(){
        require(msg.sender == gameContractAddress,"Only the game contract can call this function");
        _;
    }

    //*--------------Events--------------
    event Purchase(address buyer, uint256 amount);           //Evento quando l'utente acquista nuove monete
    event Burn(address account, uint256 amount);            //Evento quando l'utente spende nuove monete
    event Win(address account, uint256 amount);

    //*--------------Main functionalities--------------

    //Function to mint coin for a user
    function purchaseCoins(address buyer,uint256 numberOfCoins) public onlyGameContract{
        //Emette nuove monete per l'acquirente
        _mint(buyer, numberOfCoins);

        //Emessione evento di acquisto
        emit Purchase(msg.sender, numberOfCoins);
    }

    //Needed to allow the payment between players when they exchange monsters using the market
    function transferCoinsFrom(address buyer, address seller, uint256 amount) public onlyGameContract{
        _transfer(buyer, seller, amount);
    }

    //Funzione da chiamare quando un utente vince una battaglia ( e quindi guadagna monete)
    function getReward(address winner) external onlyGameContract{
        _mint(winner, reward);
        emit Win(winner, reward);
    }     

    
    //Utile quando un utente spende i token                         
    function burnFromGame(address account, uint256 amount) external onlyGameContract {
        // Chiama la funzione burn di ERC20Burnable
        _burn(account, amount);    
        emit Burn(account, amount);         
    }


}