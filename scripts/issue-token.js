const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) { // arquivo em java que chama o contrato de tokenfarm para emitir os tokens
   let tokenFarm = await TokenFarm.deployed()
   await tokenFarm.issueTokens()

    //insira o codigo

    console.log("Tokens emitidos!")

    callback()
  }


