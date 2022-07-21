require('dotenv').config();
const fs = require("fs");

const SolnSquareVerifier = JSON.parse(
  fs.readFileSync("./build/contracts/SolnSquareVerifier.json")
);

const HDWalletProvider = require('@truffle/hdwallet-provider');

const web3 = require("web3");

const proofs = require("./proofs.json");

const MNEMONIC = process.env.MNEMONIC;

const INFURA_KEY = process.env.INFURA_KEY;

const NFT_ABI = SolnSquareVerifier.abi;

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !OWNER_ADDRESS) {
  console.error(
    "Please set a mnemonic, infura key, owner and contract address."
  );

  return;
}

async function main() {
  const provider = new HDWalletProvider(
    MNEMONIC,
    `https://rinkeby.infura.io/v3/${INFURA_KEY}`
  );

  const web3Instance = new web3(provider);

  if (NFT_CONTRACT_ADDRESS) {
    const contract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    for(let i=0; i<10; i+=1) {
      const result = await contract.methods
        .mintWithProof(OWNER_ADDRESS, i+1, proofs[i].proof, proofs[i].inputs)
        .send({ from: OWNER_ADDRESS });

      console.log(`Minted token. TokenID: ${i+1}. Transaction: ${result.transactionHash}`);
    }
  }
}

main();