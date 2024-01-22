// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Owner.sol";

contract AEMonsterNFT is ERC721URIStorage{
    //*--------------State variables--------------
    //The monster struct
    struct AEMonster{                           //It is used uint8 because the max of a stat is 100
        uint256 monsterId;                      //The tokenId of the NFTs
        uint8 AP;                               //Attack Point
        uint8 DP;                               //Defence Point
        uint8 HP;                               //Health Point
        uint8 SP;                               //Speed Point
        uint8 level;                            //Higher the level stronger the monster (higher stats) //*Starting level is 1, max level is 100
        //TODO; type
    }   

    AEMonster[] public monsters;                //All the monsters created so far TODO:Maybe is better replace the use of the array


    mapping (uint256 => AEMonster) private fromIdToMonster;     //Map to get the monster stats from its id
    mapping (address =>mapping(uint256 => AEMonster)) public monstersOwnedBy;      //Map the monsters owned by an account

    uint256 private tokenId;                                    //Used to assign unique identifier to each NFT
    uint256 private randomSeed;                                 //Useful for the random number function

    address public gameContractAddress;                         //The address of the contract that manages all the dapp
 
    constructor(address _gameContractAddress) ERC721("AEMonster","AEM"){
        tokenId = 0;
        randomSeed = block.timestamp;                           //Usefull for randomness in the random function
        gameContractAddress = _gameContractAddress;
    }
    
    //*--------------Modifiers--------------
    //*Necessaria per fare in modo che le funzioni siano chiamabili solo dal contratto principale
    modifier onlyGameContract(){
        require(msg.sender == gameContractAddress,"Only the game contract can call this function");
        _;
    }

    //*--------------Main functionalities--------------
    function buyMonster(address player, string memory tokenURI) 
        external onlyGameContract returns(uint256){                                //Return the id of the created monster
        //*Creation of the monster stats
        tokenId += 1;
        AEMonster memory newMonster = AEMonster({
            monsterId: tokenId,
            AP: (uint8)(random()),
            DP: (uint8)(random()),
            HP: (uint8)(random() + 5),                //5 is the base HP for each Monster
            SP: (uint8)(random()),
            level : 1                                       
        });
            
        //Add the new monster to the collection
        monsters.push(newMonster);

        //Map the monster to the owner
        //?monstersOwnedBy[player].push(tokenId);
        monstersOwnedBy[player][tokenId] = newMonster;
            
        //*Creation of the effective  NFT
        _mint(player, tokenId);
        _setTokenURI(tokenId, tokenURI);

        //*Map the owner with the created monster
        fromIdToMonster[tokenId] = newMonster;

        return tokenId;
    }

    //This is needed in order to implement the exchange of monsters, in the market, between players
    function transferMonster(address from, address to, uint256 _tokenId) external onlyGameContract(){
        _transfer(from, to, _tokenId);
        AEMonster memory swap = monstersOwnedBy[from][_tokenId];
        delete(monstersOwnedBy[from][_tokenId]);       
        monstersOwnedBy[to][_tokenId] = swap;
    }

    //Function returns the monsters array
    function getAllMonsters() external view returns (AEMonster[] memory){
        return monsters;
    }

    //TODO : change this function 
    //Returns the id of the monsters owned by an account
    //function getOwnedMonsters(address player) public view returns (uint256[] memory){
      //  return monstersOwnedBy[player];
    //}


    //Return the monster data given its id
    function getMonsterFromId(uint256 monsterId)public view returns(AEMonster memory){
        return fromIdToMonster[monsterId];
    }


    //Funtion to generate random number
    function random() private view returns (uint256){ 
        //TODO: change this implemantation with the use of chainlink VRF : https://docs.chain.link/vrf
        return ((uint( keccak256(abi.encodePacked (msg.sender, block.timestamp, blockhash(block.number - 1)))))%10)+1;
    }


}