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
    uint256[] public sellingIds;                                                     //Identify the selling monsters id

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
    event NewOnSale(uint256 tokenId,address seller,uint256 price);
    event Retired(uint256 tokenId,address seller);
    event Selled(uint256 tokenId, address seller, address buyer);

    //*--------------Main functionalities--------------

    //Function to sell a AEthermon   
    function putOnSale(uint256 _tokenId, uint256 price) 
    external notOnSale(_tokenId) onlyOwner(_tokenId, msg.sender) priceNotBelowZero(price){ 
        sellingMap[msg.sender][_tokenId] = OnSaleMonster(msg.sender,_tokenId,price);
        sellingList[_tokenId] = OnSaleMonster(msg.sender,_tokenId,price);
        isOnSale[_tokenId] = true;
        sellingIds.push(_tokenId);
         
        emit NewOnSale(_tokenId, msg.sender, price);
    }

    //Function to retire a monster from the on sale status
    function leaveFromSale(uint256 _tokenId)
    external onSale(_tokenId) onlyOwner(_tokenId,msg.sender){
        delete(sellingMap[msg.sender][_tokenId]);
        delete(sellingList[_tokenId]);
        isOnSale[_tokenId] = false;
        removeMonsterIdsFromSelling(_tokenId);

        emit Retired(_tokenId,msg.sender);
    }

    function removeMonsterIdsFromSelling(uint256 _tokenId) private{
        uint256 indexToRemove;
        //Find the index in the array where the element is located
        for (uint256 i = 0; i < sellingIds.length; i++) {
            if (sellingIds[i] == _tokenId) {
                indexToRemove = i;
            }
        }
        //Perform the remove
        sellingIds[indexToRemove] = sellingIds[sellingIds.length - 1];
        sellingIds.pop();
    }

    //Function to change the price of an on sale AEthermon
    function changePrince(uint256 _tokenId, uint256 newPrice)
    external onSale(_tokenId) onlyOwner(_tokenId,msg.sender) priceNotBelowZero(newPrice){
        sellingMap[msg.sender][_tokenId].price = newPrice;
        sellingList[_tokenId].price = newPrice;
        
        emit NewOnSale(_tokenId, msg.sender, newPrice); 
    }

    //Function to buy a monster on sale
    function buyOnSaleMonster(uint256 _tokenId)
    external onSale(_tokenId) hasEnoughMoney(msg.sender,_tokenId){
        //Send the coins from buyer to seller
        AECoinContractAddress.transferCoinsFrom(msg.sender, sellingList[_tokenId].seller, sellingList[_tokenId].price);
        //Define the transfer of the monster
        AEMonsterContract.transferMonster(sellingList[_tokenId].seller,msg.sender,_tokenId);

        //Once the monster is sold, remove it from te selling list
        delete(sellingMap[sellingList[_tokenId].seller][_tokenId]);
        delete(sellingList[_tokenId]);
        isOnSale[_tokenId] = false;
        removeMonsterIdsFromSelling(_tokenId);

        emit Selled(_tokenId, sellingList[_tokenId].seller, msg.sender);
    }


    //Function to get the monsters on sale
    function getOnSaleMonsters()
    external view returns(OnSaleMonster[] memory){
        OnSaleMonster[] memory result = new OnSaleMonster[](sellingIds.length);
        
        for(uint256 i = 0;i<sellingIds.length;i++){
            result[i] = sellingList[sellingIds[i]];
        }

        return result;
    }
    
}