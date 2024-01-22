// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

//A contract to define a modifier for actions callable only by the owner of the contract 
contract Owner{

    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == _owner, "Only the owner of this contract can call this function");
        _;
    }

    function getOwner() public view virtual returns (address) {
        return _owner;
    }

    //*Usefull in case a change of owner is needed
    function transferOwnership(address newOwner) public virtual onlyOwner {
        _owner = newOwner;
    }
}