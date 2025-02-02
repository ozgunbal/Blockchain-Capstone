const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareVerifier = artifacts.require('SquareVerifier');
const proofs = require('../proofs.json');

contract('TestSolnSquareVerifier', async (accounts) => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const tokenIdOne = 1;
    const tokenIdTwo = 2;
    describe('match ERC721Mintable with verifier spec', () => {
        let contract;
        beforeEach(async function () {
            const verifierContract = await SquareVerifier.new()
            contract = await SolnSquareVerifier.new(verifierContract.address, {from: account_one});
        })

        it('should mint a token with valid proof', async () => {
            let isMinted = false
            try {
                await contract.mintWithProof(account_two, tokenIdOne, proofs[0].proof, proofs[0].inputs, {from: account_one});
                isMinted = true;
            } catch (err) {
                isMinted = false;
            }

            const tokenOwner = await contract.ownerOf.call(tokenIdOne);

            assert.equal(tokenOwner, account_two, "Token is not owned");
            assert.equal(isMinted, true, "Token couldn't be minted successfully");
        })

        it('should fail minting with incorrect proof', async () => {
            let isFailed = false
            try {
                await contract.mintWithProof(account_three, tokenIdTwo, proofs[0].proof, [9], {from: account_one});
            } catch (err) {
                isFailed = true;
            }
            assert.equal(isFailed, true, "Minting is not failed");
        })

        it('should fail minting with same solution again', async () => {
            await contract.mintWithProof(account_two, tokenIdOne, proofs[0].proof, proofs[0].inputs, {from: account_one});

            let isFailed = false
            try {
                await contract.mintWithProof(account_three, tokenIdTwo, proofs[0].proof, proofs[0].inputs, {from: account_one});
            } catch (err) {
                isFailed = true;
            }
            
            const tokenOwner = await contract.ownerOf.call(tokenIdOne);

            assert.equal(tokenOwner, account_two, "Token is not owned");
            assert.equal(isFailed, true, "Minting is not failed");
        })

        it('should mint 10 token in total', async () => {
            for(let i=0; i<10; i+=1) {
                await contract.mintWithProof(account_two, i + 1, proofs[i].proof, proofs[i].inputs, {from: account_one});
            }

            const result = await contract.totalSupply.call();

            assert.equal(result, 10, "Total supply is not 10");
        })
    })
})