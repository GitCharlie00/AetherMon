# Aethermon: Blockchain-based NFT Trading Platform

![Aethermon Logo](./logo.jpeg)

## Overview

Aethermon is a blockchain project developed as part of the "Blockchain and Ledger Technologies" course led by Professor Claudio di Ciccio. The primary objective of this project is to implement a blockchain that facilitates the exchange of AI-generated collectible icons, reminiscent of Pokemon. These icons, known as Non-Fungible Tokens (NFTs), can be traded and purchased within a dedicated marketplace using a custom token. Additionally, Aethermon introduces the concept of missions, allowing NFTs to undergo unique challenges that modify their characteristics.

## Features

- **NFT Trading:** Users can buy, sell, and trade Aethermons within the blockchain network.
- **Custom Token:** A dedicated token is used for transactions within the Aethermon marketplace.
- **AI-Generated Icons:** Aethermons are unique and generated using artificial intelligence, adding diversity to the collection.
- **Missions:** Aethermons can participate in missions to enhance or modify their attributes, adding a dynamic element to the gameplay.
- **Decentralized:** Aethermon operates on a decentralized blockchain, ensuring transparency and security.

## System Requirements.
- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) (Node Package Manager) installed
- [MetaMask](https://metamask.io/) installed
- [Ganache](https://trufflesuite.com/ganache/) installed
- [Truffle](https://trufflesuite.com/) installed

## Installation

1. Clone the repository on your computer:
   ```bash
   git clone https://github.com/GitCharlie00/AetherMon

2. Go to the root directory
    ```bash
    cd Aethermon

3. Run npm to install o Aethermon/AI directory
    ```bash
    cd Aethermon/AI
    npm install

## Run the project

1. Create a Ganache workspace linked with the project

2. Inesert Aethermon/Aethermon/"truffle-config.js"

3. Run on Aethermon/Aethermon
   ```bash
    truffle migrate

4. Login on MetaMask and bind the network just created with the Ganache URL

5. Run the website server
    ```bash
   cd Aethermon/website
   node app.js

6. Run the AI server
    ```bash
   cd Aethermon/AI
   node app.js

7. Open the site with localost on the Aethermon/website.js port
    ```bash
   localhost:3000

8. Login with Metamask and gotta block'em all!