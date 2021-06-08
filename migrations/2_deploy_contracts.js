const Token = artifacts.require('DbiliaToken');

module.exports = async function (deployer) {

	await deployer.deploy(Token, 'Dbilia', 'DB');
};