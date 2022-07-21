const SquareVerifier = artifacts.require('SquareVerifier');
const zokrates = require('../proof.json');

contract('TestSquareVerifier', async (accounts) => {
    describe('match verifier spec', () => {
        let contract;
        beforeEach(async function () { 
            contract = await SquareVerifier.new();
        })

        it('should verify with correct proof', async () => {
            const isVerified = await contract.verifyTx(zokrates.proof, zokrates.inputs);

            assert.equal(isVerified, true, "Couldn't verified the proof");
        })

        it('should fail verification with incorrect proof', async () => {
            const isVerified = await contract.verifyTx(zokrates.proof, [9]);

            assert.equal(isVerified, false, "Verification didn't failed");
        })
    })
})
