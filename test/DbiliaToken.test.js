const truffleAssert = require('truffle-assertions');

const Token = artifacts.require('DbiliaToken');

contract("DbiliaToken", (accounts) => {
    const tokenName = 'Dbilia';
	const tokenSymbol = 'DB';

    let tokenContractInstance;

	before(async () => {
		tokenContractInstance = await Token.deployed();
	});

    describe('deployment', async () => {
        it('deploys successfully', async () => {
          const address = tokenContractInstance.address
        //   const owner = await tokenContractInstance.owner()
        //   console.log(owner);
        //   console.log(address);
          assert.notEqual(address, 0x0)
          assert.notEqual(address, '')
          assert.notEqual(address, null)
          assert.notEqual(address, undefined)
        })

        it(' token should have right name and symbol', async () => {
            const name = await tokenContractInstance.name.call();
            const symbol = await tokenContractInstance.symbol.call();
    
            assert.equal(name, tokenName, `Token name should be ${tokenName}`);
            assert.equal(symbol, tokenSymbol, `Token symbol should be ${tokenSymbol}`);
        });



    })

})
