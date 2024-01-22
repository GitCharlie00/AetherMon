const GameContract = artifacts.require("GameContract");

module.exports =  async function(deployer){
    await deployer.deploy(GameContract);
    const gameContractInstance = await GameContract.deployed();
}