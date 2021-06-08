const truffleAssert = require('truffle-assertions');

const Token = artifacts.require('DbiliaToken');

contract("DbiliaToken", (accounts) => {
    const tokenName = 'Dbilia';
	const tokenSymbol = 'DB';

    let tokenContractInstance;

	before(async () => {
        DbiliaOwner = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
		tokenContractInstance = await Token.deployed();
        
	});

    describe('deployment', async () => {
        it('deploys successfully', async () => {
          const address = tokenContractInstance.address
          assert.notEqual(address, 0x0)
          assert.notEqual(address, '')
          assert.notEqual(address, null)
          assert.notEqual(address, undefined)
        })

        it('address[0] should be owner of the contract', async() =>{
            
          const owner = await tokenContractInstance.owner();
          assert.equal(owner,DbiliaOwner);
        })
        it('token should have right name and symbol', async () => {
            const name = await tokenContractInstance.name.call();
            const symbol = await tokenContractInstance.symbol.call();
    
            assert.equal(name, tokenName, `Token name should be ${tokenName}`);
            assert.equal(symbol, tokenSymbol, `Token symbol should be ${tokenSymbol}`);
        });



    })

    describe('mintWithUSD function', async() => {
        it('should mint with USD by Owner', async () => {
            let userID = 1001;
            let cardID = "60a4eeda0a316522509d516b)";
            let edition = 4;
            let tokenURI = 100002;
            const result = await tokenContractInstance.mintWithUSD(userID,cardID,edition,tokenURI);
            assert.equal(result.logs[1].event,"NewDbiliaTokenMinted")
        })

        it('should not mint same token twice', async () => {
            let userID = 1001;
            let cardID = "60a4eeda0a316522509d516b";
            let edition = 4;
            let tokenURI = 100002;
            try {
                await tokenContractInstance.mintWithUSD(userID,cardID,edition,tokenURI);
            } catch (error) {
                assert.isTrue(error.toString().indexOf("Card already minted")>0)
            }
        })

        it('should not mint with USD by any other user', async () => {
            let userID = 1001;
            let cardID = "60a4eeda0a316522509d516b";
            let edition = 4;
            let tokenURI = 100003;
            try {
                await tokenContractInstance.mintWithUSD(userID,cardID,edition,tokenURI,{from:user1 });
            } catch (error) {
                assert.isTrue(error.toString().indexOf("Ownable: caller is not the owner")>0)
            }

        })
    })

    describe('mintWithETH function', async() => {
        it('should mint with ETH by Any user', async () => {
            let cardID = "60a4eeda0a316522509d516b)";
            let edition = 4;
            let tokenURI = 100003;
            const result = await tokenContractInstance.mintWithETH(cardID,edition,tokenURI,{from:user2 });
            assert.equal(result.logs[1].event,"NewDbiliaTokenMinted")
        })

        it('should not mint same token twice', async () => {
            let cardID = "60a4eeda0a316522509d516b";
            let edition = 4;
            let tokenURI = 100003;
            try {
                await tokenContractInstance.mintWithETH(cardID,edition,tokenURI,{from:user2 });
            } catch (error) {
                assert.isTrue(error.toString().indexOf("Card already minted")>0)
            }
        })

    })

})
