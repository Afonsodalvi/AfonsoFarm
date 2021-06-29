const DappToken= artifacts.require('DappToken')
const DaiToken= artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) { //aqui identifica as contas do ganache que irá fazer o deploy
  // Deploy Mock DAI Token
  await deployer.deploy(DaiToken) //aqui fala para esperar e depois fazer o deploy do Dai que seria uma moeda digital
  const daiToken = await DaiToken.deployed()
  
  // Deploy Dapp Token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  // Deploy TokenFarm
  // o TokenFarm seria um banco digital onde os dois acima depositam valores
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // transferir todos os tokens para o TokenFarm (1 milhão)

  await dappToken.transfer(tokenFarm.address, '100000000000000000000000') // o valor de um dollar que seria 1.00 no valor de tokens seria mais 18 zeros após esse valor ou seja, 1.00000000000000000000.
  // em solidity não tem decimals e por isso o valor acima

  // transferir 100 Mock DAI tokens para o investidor
  await daiToken.transfer(accounts[1], '100000000000000000000') // O valor aqui inserido é 100 mais 18 zeros que representa 100 Mock
  // a definição de account acima é relacionado a conta do ganache que irá transferir, sendo a primeira abaixo da principal (considere a principal como 0 e logo após ela seria 1)

}

