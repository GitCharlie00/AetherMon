// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

//Needed to interact with the game coin and the AEthermons
import "./AECoin.sol";
import "./AEMonster.sol";

//This contract implement the functionalities needed to exhange AEthermons between players
contract AEMarket{
    //*--------------State variable--------------
    mapping(address => mapping(uint256 => OnSaleMonster)) public sellingMap;        //It defines the on sale monster for each player                     
    mapping(uint256 => OnSaleMonster) sellingList;                                  //All the monster on sale state
    mapping(uint256 => bool) private isOnSale;                                       //Allows better performance (avoid search in the array)

    AECoinFT public AECoinContractAddress;                        
    AEMonsterNFT public AEMonsterContract; 

    constructor(){
        AECoinContractAddress = new AECoinFT(address(this));
        AEMonsterContract = new AEMonsterNFT(address(this));
    }


    //*--------------Structures--------------
    struct OnSaleMonster{         //It defines a sale
        address seller;           //The seller of the token
        uint256 tokenId;          //The identifier of the NFTMonster
        uint256 price;            //The selling price
    }


    //*--------------Modifiers--------------
    modifier notOnSale(uint256 tokenId){
        require(isOnSale[tokenId] == false,"The selected AEthermon was already on sale!");
        _;
    }

    modifier onSale(uint256 tokenId){
        require(isOnSale[tokenId] == true,"The selected AEthermon was not on sale!");
        _;
    }

    modifier priceNotBelowZero(uint256 price){
        require(price > 0, "The selling price must be greater than 0");
        _;
    }

    modifier onlyOwner(uint256 tokenId, address caller){
        require(AEMonsterContract.ownerOf(tokenId) == caller, "Only the owner of the AEthermon can call this function");
        _;
    }

    modifier hasEnoughMoney(address player, uint256 tokenId){
        require(AECoinContractAddress.balanceOf(player) >= sellingList[tokenId].price, "You haven't enough AECoins to buy this monster");
        _;
    }

    //*--------------Events--------------
    //TODO : selled , onSale, Retired, ...
    event NewOnSale(uint256 tokenId,address seller,uint256 price);
    event Retired(uint256 tokenId,address seller);
    event Selled(uint256 tokenId, address seller, address buyer);

    //*--------------Main functionalities--------------

    //Function to sell a AEthermon   
    function putOnSale(uint256 tokenId, uint256 price) 
    external notOnSale(tokenId) onlyOwner(tokenId, msg.sender) priceNotBelowZero(price){ 
        sellingMap[msg.sender][tokenId] = OnSaleMonster(msg.sender,tokenId,price);
        sellingList[tokenId] = OnSaleMonster(msg.sender,tokenId,price);
        isOnSale[tokenId] = true;

        emit NewOnSale(tokenId, msg.sender, price);
    }

    //Function to retire a monster from the on sale status
    function leaveFromSale(uint256 tokenId)
    external onSale(tokenId) onlyOwner(tokenId,msg.sender){
        delete(sellingMap[msg.sender][tokenId]);
        delete(sellingList[tokenId]);
        isOnSale[tokenId] = false;

        emit Retired(tokenId,msg.sender);
    }

    //Function to change the price of an on sale AEthermon
    function changePrince(uint256 tokenId, uint256 newPrice)
    external onSale(tokenId) onlyOwner(tokenId,msg.sender) priceNotBelowZero(newPrice){
        sellingMap[msg.sender][tokenId].price = newPrice;
        sellingList[tokenId].price = newPrice;
        
        emit NewOnSale(tokenId, msg.sender, newPrice); 
    }

    //Function to buy a monster on sale
    function buyOnSaleMonster(uint256 tokenId)
    external onSale(tokenId) hasEnoughMoney(msg.sender,tokenId){
        //Send the coins from buyer to seller
        AECoinContractAddress.transferCoinsFrom(msg.sender, sellingList[tokenId].seller, sellingList[tokenId].price);
        //Define the transfer of the monster
        AEMonsterContract.transferMonster(sellingList[tokenId].seller,msg.sender,tokenId);
        emit Selled(tokenId, sellingList[tokenId].seller, msg.sender);
    }
    
}