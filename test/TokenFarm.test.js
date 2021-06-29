const DappToken= artifacts.require('DappToken')
const DaiToken= artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n){
    return web3.utils.toWei(n,'ether');
}

contract('TokenFarm', ([owner, investor])=>{
    let daiToken, dappToken, tokenFarm

    before(async ()=>{
        //baixar contratos
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
        
        // transferir todos os  dapptokens para o tokenfarm
        await dappToken.transfer(tokenFarm.address, tokens('1000000')) //insereimos aqui exatamente o valor que esta no arquivo 2_deploy_contracts.js referente ao dapptoken

        // enviar tokens para o investidor
        await daiToken.transfer(investor, tokens('100'), {from: owner})
    })

    describe('Mock DAI deployment', async ()=>{
        it ('has a name', async ()=> {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async ()=>{
        it ('has a name', async ()=> {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async ()=>{
        it ('has a name', async ()=> {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })

        it ('contract has tokens', async ()=> {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe ('Farming tokens', async ()=>{

        it('rewards investors for staking mDai tokens', async () => {
            let result

            // conferindo se o investidor tem dinheiro antes da aposta
            result = await daiToken.balanceOf (investor)
            assert.equal(result.toString(), tokens('100'), 'investidor Mock DAI os saldos da carteira do investidor estão corretos antes de aposta')

            // apostas(stake) Mock DAI Tokens, aprovaçoes
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
            await tokenFarm.stakeTokens(tokens('100'), {from: investor})

            // conferir os resultados das apostas (staking), onde o apostador terá 0 tokens na sua carteira após investir
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investidor Mock DAI wallet saldos corretos após aposta')

            result = await daiToken.balanceOf (tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI saldos corretos após aposta')


            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(),tokens('100'), 'investidor apostador saldos corretos após aposta')


            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investidor apostador status correto após aposta')

            // emissão de tokens (Issue tokens)
            await tokenFarm.issueTokens({ from: owner})
            
            //confira os saldos depois das emissões (check balances after issuance)
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), ' investidor DApp Token saldo correto após a emissão')

            //garantir que somente o dono pode emitir tokens (ensure that only anwer can issue tokens)
            await tokenFarm.issueTokens({ from: investor}).should.be.rejected;

            // retirada dos tokens (Unstake tokens)
            await tokenFarm.unstakeTokens({ from: investor})

            // confira os resultados após retirada do token (check results after unstaking)
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('100'), 'investidor Mock DAI saldo correto depois da retirada')

            // vamos zerar as contas e os valores investidos por ela que retirou o token
            result = await daiToken.balanceOf (tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI saldos corretos após retirada')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(),tokens('0'), 'investidor apostador saldos corretos após retirada')

            //mudança de status apos retirada
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investidor apostador status correto após retirada')

        })
    })

})

