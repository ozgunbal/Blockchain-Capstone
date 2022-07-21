var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', async (accounts) => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const tokenIdOne = 1;
    const tokenIdTwo = 2;
    const tokenIdThere = 3;

    describe('match erc721 spec', function () {
        let contract;
        beforeEach(async function () { 
            contract = await ERC721MintableComplete.new({from: account_one});

            // minting multiple tokens
            await contract.mint(account_two, tokenIdOne, {from: account_one});
            await contract.mint(account_two, tokenIdTwo, {from: account_one});
            await contract.mint(account_two, tokenIdThere, {from: account_one});
        })

        it('should return total supply', async function () { 
            const result = await contract.totalSupply.call();

            assert.equal(result, 3, "Total supply is not right");
        })

        it('should get token balance', async function () { 
            const result = await contract.balanceOf.call(account_two);

            assert.equal(result, 3, "Balance of account is not right");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenURI = await contract.tokenURI(tokenIdOne);
            const baseTokenURI = await contract.baseTokenURI.call();

            assert.equal(baseTokenURI, `https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/`, "Base token uri is not right");
            assert.equal(tokenURI, `https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/${tokenIdOne}`, "Token uri is not right");
        })

        it('should transfer token from one owner to another', async function () {
            const initialOwner = await contract.ownerOf.call(tokenIdOne); 
            await contract.transferFrom(account_two, account_three, tokenIdOne, { from: account_two})
            const finalOwner = await contract.ownerOf.call(tokenIdOne);

            assert.equal(initialOwner, account_two, "Initial owner is not right");
            assert.equal(finalOwner, account_three, "Final owner is not right");
        })
    });

    describe('have ownership properties', function () {
        let contract;
        beforeEach(async function () { 
            contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let isFailed = false
            try {
                await contract.mint(account_three, tokenIdOne, {from: account_two});
            } catch (err) {
                isFailed = true;
            }
            assert.equal(isFailed, true, "Minting is not failed");
        })

        it('should return contract owner', async function () { 
          const owner = await contract.owner.call();

          assert.equal(owner, account_one, "Owner is not right");
        })

    });
})