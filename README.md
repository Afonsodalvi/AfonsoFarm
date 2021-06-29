# AfonsoFarm
Modelo de site de Farm com conexão na wallet MetaMask. Utilizando Solidity, JavaScript, Html e css. 
Tenha instalado no sua máquina o Node.js, Ganache, VisualCode e se possível a maquina virtual UBUNTU (Linux). Digite em seu prompt: truffle install
Copie o repositório do git.
Siga as intruções:
npm install
npm install -g npm (caso precise atualizar, não fiz isso no UBUNTU)
Abra o ganache, sendo que vamos usar as contas fakes que existem lá. Ao abrir e clicar na chave a esquerda das contas você terá acesso as chaves públicas e privadas.
No arquivo truffle-confg.js o código é referente a exportação da conta ganache repare que existe networking id e host etc..
O código dentro do truffle-confg.js é igual o abaixo. Porém inseri explicações das linhas de código:
require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", //aqui é o endereço da rede no ganache, abra ele e verá que é o mesmo
      port: 7545, // a porta do ganache
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/', //definimos o diretorio onde esta os contratos
  contracts_build_directory: './src/abis/', // diretorio de construção dos contratos em json
  compilers: { //compilação em solidity
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}



Vamos a criação de arquivos e contratos:
(obs: mudei todos os contratos para a versão atualizada do solidity sendo que está instalado a versão atual na minha extensão solc.0.7.4. Então inseri em todos os contratos: // SPDX-License-Identifier: MIT
pragma solidity >=0.7.4;

Feito isso, Vá na pasta contracts
Crie um arquivo: TokenFarm.sol
Insira o código: // SPDX-License-Identifier: MIT
pragma solidity >=0.7.4;
OU 
pragma solidity ^0.5.0;
contract TokenFarm{

    string public name= "Dapp Token Farm";
    
}
(obs. Irei completar)
Agora crie outro arquivo em pasta migrations
Chamado de 2_deploy_contracts.js
E insira o seguinte código: 
const TokenFarm = artifacts.require('TokenFarm')

module.exports = function(deployer) {
  deployer.deploy(TokenFarm)
}


Execute:
truffle compile

(AO EXECUTAR O truffle compile DEU ERRO NO TERMINAL DO VISUAL CODE SENDO NO WINDOWS, DESSA FORMA FIZ NO UBUNTU E OBTIVE SUCESSO). Conforme imagem:
 
Repare que a versão que usei de solidity é a 0.5.0. caso queira usar ela instale antes com npm install solc@0.5.0 e continue.
Sendo assim, a compilação dos contratos em truffle na pasta contracts foram executadas.
Repare em abis que temos o contrato TokenFarm.json agora:
 
Vamos seguir, agora executaremos um código para migrar o contrato Token Farm, repare o seguinte: dentro do arquivo 2_deploy_contracts.js que criamos esta definido qual contrato que será feito o deploy, no caso o TokenFarm e no arquivo 1_initial_migration.js, então execute em seu terminal:
truffle migrate
aqui é definido o arquivo de migração para a blockchain com o numero de transação hash e as informações do deployng, conforme imagens: 
 
 

Em seguida, abra o Ganache e rapare na primeira conta que esta definida aqui no deploy em account, verpa que está agora em 99.99 ETH. 
 
Sucesso, agora vamos interagir com o contrato. Execute no terminal:
truffle console
irá ter o resultado: truffle(developmente)>
Sendo assim, digite:
tokenFarm = await TokenFarm.deployed()  (obs. Aqui definimos que o contrato vai para a blockchain e faz o deploy, com a palavra await é uma promessa de funcionamento)
terá o resultado undefined, mas não se preocupe. Digite agora o seguinte:
tokenFarm              (OBS. Esta com letra minúscula igualmente na definição acima)
E termos nosso contrato com o bytecode o valor do gas e etc, conforme parte da imagem:
 

SEMPRE QUE FOR EXECUTAR OS ARQUIVOS DESSA AULA ABRA O GANACHE E O UBUNTU, EM SEU TERMINAL DIGITE:
Cd Depp – (crie sua própria pasta)
cd defi_tutorial (aqui será AfonsoFarm ou o nome que escolher)
E para abrir o contrato no truffle executar: truffle console / tokenFarm = await TokenFarm.deployed()  ou seja (nome contrato com inicio minúsculo)=await (nome do contrato do arquivo em sol).deployed() / por fim digitar no truffle(development)> tokenFarm (nome do  contrato com letra minuscula).
Agora vamos saber o endereço d contrato de token:
tokenFarm.address
Deve retornar o seguinte:
 

Configure o nome do contrato:
name = await tokenFarm.name()
Feito isso, digite em seu terminal:
name
Com isso, terá o nome do contrato: ‘Dapp Token Farm’
Agora vamos as etapas de deploy dos contratos que temos nos arquivos, os arquivos serão importados dentro do contrato TokenFarm.sol. Em três etapas: deploy DAI; deploy DAPP; deploy TokenFarm.
Digite no arquivo do TokenFarm.sol dentro do visual code:
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm{

    string public name= "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;

    }
}

Logo apo´s vá no arquivo na pasta migrations em 2_deploy_contracts.js e digite:
(OBS. PRESTE BASTANTE ATENÇÃO AO DIGITAR, É NORMAL POR ERRO DE DIGITAÇÃO APARACER ALGUNS “PROBLEMAS”)
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

A explicação de alguns códigos e funções está no próprio código acima. Feito isso, vamos executar que o truffle faça a compilação dos arquivos, em seu terminal ubuntu:
Antes de executar o compilador temos que conferir se estamos dentro do truffle desenvolvedor, caso esteja no seu terminal o seguinte: truffle(development)> 
Devemos sair dele executando:
.exit
git status
git add .
git commit -am "Part 1"
git status
Feito isso, podemos executar no diretório cd defi_tutorial:
truffle compile
Que o resultado será o seguinte:
 

Logo após executar:
truffle migrate --reset

Porém deu o seguinte erro:
 
Repare no arquivo 2_deploy_contracts.js eu havia inseridoo seguinte const TokenFarm = await TokenFarm.deployed()
Porém depois do const deve ser “tokenFarm” com letra minúscula, preste atenção nos detalhes da excrita do código. (OBS. NO CÓDIGO DO MATERIAL JÁ INSERI A FORMA CORRETA, ENTÃO IRÁ DAR CERTO, SOMENTE CONTINUE COM AS INSTRUÇÕES ABAIXO)
Agora ao executar truffle migrate –-reset
Irá dar certo a compilação do TokenFarm, porém há um erro de definição de conta:
 
Novamente um erro de digitação bobo, percebe que no erro ele indica a linha e em qual arquivo esta, fui ao arquivo na linha 25 e percebei que escrevi “account” no singular sendo que deve ser no plural “accounts”. (OBS. JÁ CORRIGI O ERRO NO CÓDIGO ACIMA, PROVAVELMENTE NÃO IRÁ APARACER PARA VOCÊ) 
Corrigido o erro, deve aparecer o seguinte em seu terminal:
 
Vamos continuar, abra o console do truffle: (OBS. AQUI ESTAMOS DEFININDO FUNÇÕES, DENTRO DO TRUFFLE LIGANDO AOS ARQUIVOS JS)
truffle console

mDai = await DaiToken.deployed()  (DEFINI AQUI UMA FUNÇAO DE DEPLOY DO DaiToken)
accounts = await web3.eth.getAccounts() (DEFINIMOS AQUI UMA FUNÇÃO DE PEGAR O NÚMERO DO CAONTA DA WEB3, NO CASO O GANACHE QUE ESTA ABERTO EM SUA MÁQUINA)
Repare que definimos a função acima de buscar a conta, então vamos executa-la em nosso terminal:
accounts[1]
Teremos de retorno a segunda conta do ganache: 
 
 
Pronto, vamos fazer outra função:
balance = await mDai.balanceOf(accounts[1])  (CRIAMOS A FUNÇÃO DE RETORNAR O SALDO, REPARE NO ARQUIVO DaiToken.sol no visual code QUE TERÁ NO MAPPING EM SOLIDITY O balanceOf, sendo este publico)
Execute:
balance
E depois:
balance.toString()
Teremos o seguinte resultado exatamente com o valor que declaramos no DaiToken.sol:
 
Feito isso, no arquivo DaiToken.sol na função mapping a chave de endereço indica um numero inteiro, e repare que declaramos ela como pública, e por isso ao executar o balance aqui ela retorna o valor referente ao endereço indicado. 
 mapping(address => uint256) public balanceOf;

Execute agora para formatar o valor e converter em ether:
formattedBalance = web3.utils.fromWei(balance)
teremos como resultado: 100, sendo que são 18 zeros após ele definidos os decimais, que é o valor em wei convertidos para ether. Ou seja, são 100 ether. Para converter ether em wei use o site: https://etherchain.org/tools/unitConverter
no próprio truffle conseguimos executar funções para converter ethers em wei:
web3.utils.toWei('1.5','Ether')
que lhe dará o valor 1500000000000000000
Então, agora temos o sucesso na migração do contrato.
Vamos sair do truffle
.exit
E vamos criar uma pasta de teste dos contratos antes de inserir ele na rede blockchain. Então, execute em seu terminal para criar uma pasta:
mkdir test
touch test/TokenFarm.test.js

Pronto criamos a pasta e arquivo TokenFarm.teste.js. Agora no visual code se abrirmos  o package.joson iremos ver que existe instalado o “chai”:”4.2.0 que é um framwork do mocha test. Vá no site do mocha: https://mochajs.org/     e também no chai onde há uma biblioteca de códigos https://www.chaijs.com/
Agora dentro do arquivo que criamos TokenFarm.test.js insira o seguinte código:
const DappToken= artifacts.require('DappToken')
const DaiToken= artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('TokenFarm', (accounts)=>{
    // ESCREVA O TESTE AQUI
    describe('Mock Dai deployment', async ()=>{
        it ('has a name', async ()=> {
            let daiToken = await DaiToken.new()
            const name = await daiToken.name()
            assert.equal(name, 'Mack Dai Token')
        })
    })

})

Agora vamos em nosso terminal ubuntu e testar no truffle, execute: (lembre-se sempre de salvar no visual code as mudanças antes de executar)
truffle test
Repare em um erro que aparece caso digitamos algo errado no arquivo de teste que não esteja de acordo com contrato:
 
Repare que ele indica que a expectativa é a palavra “Mock DAI Token”, sendo que no contrato DaiToken.sol está escrito exatamente desta forma, por isso da o erro quando digita o “Dai”e “Mack”no código em js, sem as letras maiúsculas, ao buscar a referência no contrato não irá encontrar e retorna o erro. Com isso, no seu não terá esse problema, sendo que o código já está escrito de forma correta, então continue...
Deve aparecer o seguinte resultado em seu terminal:
 
Pronto, o teste deu certo. Agora vamos fazer outro teste e modificar o código no arquivo TokenFarm.test.js
const DappToken= artifacts.require('DappToken')
const DaiToken= artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('TokenFarm', (accounts)=>{
//perecebe que mudamos aqui embaixo onde inserimos o teste
    let daiToken

    before(async ()=>{
        daiToken = await DaiToken.new()
    })

    describe('Mock DAI deployment', async ()=>{
        it ('has a name', async ()=> {
            let daiToken = await DaiToken.new()
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

})

Agora em seu terminal execute novamente o: 
truffle test

Com isso, irá passar o contrato com a seguinte mensagem:
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.
  Contract: TokenFarm
    Mock DAI deployment
      ✓ has a name (624ms)
  1 passing (1s)
Deve dar a mesma resposta que o teste anterior, então vamos continuar. Repare que onde inserimos o código “novo” é o local onde inserimos o código para fazer o teste dos contratos. Então, dessa forma vamos modificar mais para fazer os contratos que criamos funcionarem acrescentando os seguintes códigos em seu arquivo TokenFarm.test.js
const DappToken= artifacts.require('DappToken')
const DaiToken= artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('TokenFarm', (accounts)=>{
    let daiToken, dappToken, tokenFarm

    before(async ()=>{
        //baixar contratos
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
        
        // transferir todos os  dapptokens para o tokenfarm
        await dappToken.transfer(tokenFarm.address,'100000000000000000000000') //insereimos aqui exatamente o valor que esta no arquivo 2_deploy_contracts.js referente ao dapptoken
    })

    describe('Mock DAI deployment', async ()=>{
        it ('has a name', async ()=> {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

})

Durante a aula apareceu o seguinte erro “ReferenceError: dappToken is not defined” por não termos especificados no código de transferência para onde iria o valor do dappToken: (OBS. O código acima já esta com a correção, deste modo o erro abaixo é para dar suporte caso aconteça na prática em outros projetos)
 
Passado isso, e inserindo o código acima ao executar:
truffle test
Deve aparecer:
Contract: TokenFarm
    Mock DAI deployment
      ✓ has a name (232ms)
  1 passing (2s)
Sendo assim, o contrato foi executado com sucesso. Vamos adiante.
Vamos agora inserir uma função em nosso arquivo de teste que representa o valor em ether e conversão de wei. TokenFarm.test.js
Vamos entender a mudança abaixo, repare que modificamos e inserimos algumas coisas, primeiro inserimeos a função tokens, que agora a palavra “tokens” é referente a um valor em ether. Logo depois em contracts inserimos owner e investor, que são o dono e o investidor respectivamente, faremos referência a eles na hora de enviar tokens de entre contas, vc deve notar que o owner é a conta 0 que é a primeira conta do ganache e o investor  é a segunda que representa 1. Poderíamos deixar como accounts[1] que seria o investidor e accounts[0] que seria o dono, porém mudamos a definição para “owner” e “investor”, portanto em daiToken será enviado e transferido os tokens entre  o dono e investidor (traduzido). Conforme o código abaixo:

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

})

Inserido o código execute em seu terminal:
truffle test
e terá sucesso.
Continuando a mudança de teste iremos inserir no mesmo arquivo Token.test a descrição de todos os tokens e o balanço das transações:
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

})

Feito isso, execute mais uma vez no terminal ubuntu:
truffle test
Deve ter o sucesso das 4 mudanças feitas. Vamos à próxima etapa do curso:

STAKE TOKENS (TOKENS DO ACIONISTA/APOSTADOR) 
Para começar a próxima aula abra o ubuntu e vá aos diretórios:
cd Depp
cd defi_tutorial

Agora vamos abrir o contrato inteligente TokenFarm.sol e lá vamos inserir alguns códigos a mais, sendo primeiro Stakes Tokens (depositar) , segundo Unstaking Tokens (retirar) e por ultimo Issuing Tokens(usar). Vamos ao código novo:
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm{

    string public name= "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers; // criamos aqui a chamada array, que irá contar sempre que alguem comprar um staketoken, e dará um numero, [1,2,3...] ou um string ["afonso","camila","joao"] ou address ["0X0, "0X1"]

    mapping(address=>uint) public stakingBalance; //aqui indica quantos tokens o enedereço possui
    mapping(address => bool) public hasStaked; // aqui indica se o endereço possui ou não staketoken
    mapping(address => bool) public isStaking;
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;

    }

    // 1. Stakes Tokens (depositar)
    function stakeTokens(uint _amount) public { // o amount é o valor depositado de tokens
        //aqui vc inseri o código da funcão
        //vamos usar abaixo para transferir Mock Dai tokens para esse contrato por staking (aposta)
        daiToken.transferFrom(msg.sender, address(this), _amount); // quando inserimos o this fazemos referencia ao endereço do dono do token daiToken aqui mencionado.

        // atualizar o numero de Staketokens comprados sempre q alguem adquirir mais um
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // adicione usuários na lista de stakers somente se o stake (apostador) já não tenha apostado, se ele já apostou não será adicionado.
        if (!hasStaked[msg.sender]){ // determinamos uma condição em que somente o endereço que já não tenha apostado (aqui é o mapping que possui bool, verdadeiro ou falso) e cadastrou (qui seria a array que cadastrou o endereço) pode depositar mais valores
            stakers.push(msg.sender);
        }
        // atualização do status aposta
        isStaking[msg.sender]= true;
        hasStaked [msg.sender] = true;
    }


    //2. Unstaking Tokens (retirar)


    //3. Issuing Tokens (usar)
}

Observe os códigos dos contrato, primeiramente existe a importação de dois contratos o DappToken e o DaiToken. Sendo assim, ao aolhar na estrutura de todos os contratos irá perceber que as funções, construções e variáveis faz referencias aos demais. Com isso, há uma criação do token do curso em DappToken que tem seu próprio valor e o DaiToken, com os mesmo códigos para criar um token, porém com outro nome e referência a outro token. (OBS. São tokens de apostas e no código acima explica algumas funções do contrato)
Feito o contrato agora vamos ao arquivo de teste, em TokenFarm.teste.js, vamos inserir os códigos para testar as modificações do contrato repare na linha 57’ para baixo, há a describe é uma descrição de tokens do contrato da fazenda que criamos, com tokens de agricultura (Farming Tokens) onde os investidores são recompensados por apostarem tokens mDai na fazenda. Porém, os saldos dos investidores são conferidos e corrigem antes de apostarem. Confira abaixo:
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
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balances correct before staking')
        })
    })

})

Agora que modificamos os códigos vamos salvar no visual code e executar no terminal UBUNTU:
truffle test
Com isso, deve aparecer a seguinte mensagem de sucesso das cinco deploys do contrato Farm:
 
Dessa forma, demonstra que houve a execução de todas as 5 mudanças. Repare se caso você modifique o valor real do tokens no arquivo TokenFarm na linha 65 do código para o valor ‘10” por exemplo, irá aparecer o erro: investor Mock DAI wallet balances correct before staking
      + expected - actual

      -100000000000000000000
      +10000000000000000000  
Dessa forma, devemos entender que os valores precisam estar corretos. Corrija para 100 e Vamos continuar...
Vamos inserir mais códigos no arquivo TokenFarm.teste.js, dessa vez de aprovação e conferir o resultados das apostas (staking). Nesse arquivo eu traduzi o código já para como investidores apostadores, se repararmos no contrato do TokenFarm e DaiToken, iremos fazer referencia a alguns pontos deles como o balanceOf que seria os saldos das carteiras, o stakingBalances o saldo dos apostadores e também se é apostador ou não, com uma booliana de verdadeiro ou falso na linha 86 do nosso código, vejamos:
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
        })
    })

})

Feito isso, vá em seu terminal UBUNTU e digite novamente o teste do truffle:
truffle test
Terá o seguinte resultado:
Contract: TokenFarm
    Mock DAI deployment
      ✓ has a name (125ms)
    Dapp Token deployment
      ✓ has a name (103ms)
    Token Farm deployment
      ✓ has a name (131ms)
      ✓ contract has tokens (109ms)
    Farming tokens
      ✓ rewards investors for staking mDai tokens (1487ms)
  5 passing (4s)
Deve aparecer o resultado acima...sucesso os tokens de apostas estão criados já com algumas funcionalidades de saldos.

ISSUE TOKENS (EMISSÃO DE TOKENS)
Aqui vamos aprender a emitir os tokens, então dentro do arquivo em solidity no contrato inteligente TokenFarm.sol vamos inserir uma função de emitir tokens.

TokenFarm.sol
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm{

    string public name= "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;
   

    address[] public stakers; // criamos aqui a chamada array, que irá contar sempre que alguem comprar um staketoken, e dará um numero, [1,2,3...] ou um string ["afonso","camila","joao"] ou address ["0X0, "0X1"]

    mapping(address=>uint) public stakingBalance; //aqui indica quantos tokens o enedereço possui
    mapping(address => bool) public hasStaked; // aqui indica se o endereço possui ou não staketoken (token de aposta)
    mapping(address => bool) public isStaking; // se o endereco é quem apostou ou nao
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stakes Tokens (depositar)
    function stakeTokens(uint _amount) public { // o amount é o valor depositado de tokens
        //aqui vc inseri o código da funcão
        //vamos usar abaixo para transferir Mock Dai tokens para esse contrato por staking (aposta)
        
        // (requiere) condicao de que a quantidade tem que ser maior que zero
        require (_amount > 0, "quantidade não pode ser 0"); 


        daiToken.transferFrom(msg.sender, address(this), _amount); // quando inserimos o this fazemos referencia ao endereço do dono do token daiToken aqui mencionado.


        // atualizar o numero de Staketokens comprados sempre q alguem adquirir mais um
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // adicione usuários na lista de stakers somente se o stake (apostador) já não tenha apostado, se ele já apostou não será adicionado.
        if (!hasStaked[msg.sender]){ // determinamos uma condição em que somente o endereço que já não tenha apostado (aqui é o mapping que possui bool, verdadeiro ou falso) e cadastrou (qui seria a array que cadastrou o endereço) pode depositar mais valores
            stakers.push(msg.sender);
        }
        // atualização do status aposta
        isStaking[msg.sender]= true;
        hasStaked [msg.sender] = true;
    }


    //Unstaking Tokens (retirar)

    // Issuing Tokens (emitir tokens)
        function issueToken() public { 
            require (msg.sender == owner, "somente o dono pode emitir tokens");// defeinimos aqui uma condição que somente o dono do contrato pode executar essa funcao, ou seja, quem fez o deploy que é representado pelo msg.sender

            // emissão de tokens para todos os apostadores
            for (uint i=0; i<stakers.length; i++) { // aqui soma e cadastra os apostadores dentro da array quando não for menor q zero, falamos que i(que seria representado pelo apostador) seria igual a zero inicialmente, e quando acresenta i(apostador) vai somanando, ou seja, como começa no 0 o segundo seria 1 o terceiro 2 e assim por diante
                address recipient = stakers[i]; // o endereco recebedor é o apostador dentro da array e cadastrado
                uint balance =stakingBalance[recipient]; //o saldo é igual o saldo do apostador recebedor
                if(balance > 0) { // se saldo maior que 0
                    dappToken.transfer(recipient, balance); // tarnfere o dappToken o recebedor e o saldo
                }
                
            }

        }
}


(observe todas as modificações e explicações que já estão no código)
Após implementar o código do contrato acima digite em seu terminal:
truffle compile
e terá sucesso na compilação, caso digite ou esqueça de inserir qualquer coisa deve aparecer um erro parecido com o abaixo: (obs. O código acima esta correto e portanto com ele não deve aparecer o erro).
 
Repare que o erro demonstra a expectativa de colocar “;” e a linha do código dela. Ao corrigir eu executei o truffle compile em seguida e o obteve sucesso na compilação.
Com isso, vamos seguir. Agora devemos implementar as funções do contrato e a parte de emissão dos tokens dos mesmos no arquivo em javascript e teste, então abra o arquivo TokenFarm.teste.js e insira:
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

            // emissão de tokens
            await tokenFarm.issueTokens({ from: owner})
            
            //confira os saldos depois das emissões
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), ' investidor DApp Token saldo correto após a emissão')

            //garantir que somente o dono pode emitir tokens
            await tokenFarm.issueTokens({ from: investor}).should.be.rejected;

        })
    })

})

Repare que inserimos no arquivo acima a partir da linha 90 do código novas funcionalidades que ligam as mudanças feitas no contrato tokenfarm em solidity. Abaixo é um erro quando digitamos o nome da função de referência errada em js, repare que fala que tokenFarm.issueTokens is not a function, tendo em vista que o código do contrato esta escrito “issueToken” sem o “s” e por isso o erro. Porém, o código acima já esta corrigido e você continuará sem problemas.
 
Portanto, faça o teste com:
truffle test
Mais um erro por não observar as sintaxes e palavras:
 
Escrevi “reject” e não “rejected” (obs. No nosso código já esta corrigido). Depois de executar o truffle test e ter sucesso, continue....
Agora vamos fazer outra função dentro do contrato TokenFarm.sol, lembrando que sempre que formos inserindo funções devemos ir testando e compilando. A função se chama unstaking tokens (withdraw) - tokens desmontados (retirar). Possibilidade do apostador retirar o token que apostou. Aqui vamos atualizar a conta dele entre outras funcionalidades já explicadas no código abaixo da linha 54 a 66:
TokenFarm.sol
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm{

    string public name= "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;
   

    address[] public stakers; // criamos aqui a chamada array, que irá contar sempre que alguem comprar um staketoken, e dará um numero, [1,2,3...] ou um string ["afonso","camila","joao"] ou address ["0X0, "0X1"]

    mapping(address=>uint) public stakingBalance; //aqui indica quantos tokens o enedereço possui
    mapping(address => bool) public hasStaked; // aqui indica se o endereço possui ou não staketoken (token de aposta)
    mapping(address => bool) public isStaking; // se o endereco é quem apostou ou nao
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stakes Tokens (depositar)
    function stakeTokens(uint _amount) public { // o amount é o valor depositado de tokens
        //aqui vc inseri o código da funcão
        //vamos usar abaixo para transferir Mock Dai tokens para esse contrato por staking (aposta)
        
        // (requiere) condicao de que a quantidade tem que ser maior que zero
        require (_amount > 0, "quantidade não pode ser 0"); 


        daiToken.transferFrom(msg.sender, address(this), _amount); // quando inserimos o this fazemos referencia ao endereço do dono do token daiToken aqui mencionado.


        // atualizar o numero de Staketokens comprados sempre q alguem adquirir mais um
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // adicione usuários na lista de stakers somente se o stake (apostador) já não tenha apostado, se ele já apostou não será adicionado.
        if (!hasStaked[msg.sender]){ // determinamos uma condição em que somente o endereço que já não tenha apostado (aqui é o mapping que possui bool, verdadeiro ou falso) e cadastrou (qui seria a array que cadastrou o endereço) pode depositar mais valores
            stakers.push(msg.sender);
        }
        // atualização do status aposta
        isStaking[msg.sender]= true;
        hasStaked [msg.sender] = true;
    }


    //Unstaking Tokens (retirar)
    function unstakeTokens() public{
        //fetch staking balance (buscar saldo do apostador-equilibrio)
        uint balance = stakingBalance[msg.sender];
        // require- condicao de que montante seja maior que 0
        require(balance > 0,"o saldo do apostador não pode ser 0");
        //transferir Mock Dai tokens de volta a conta do apostador que solicitou
        daiToken.transfer(msg.sender, balance);
        // resetar saldo do apostador para 0, onde fica declarado que ele não tem mais apostas
        stakingBalance[msg.sender]=0;
        // atualizar o status do apostador, que agora ficará falso. onde ele não é mais apostador
        isStaking[msg.sender] = false;
    }

    // Issuing Tokens (emitir tokens)
        function issueTokens() public { 
            require (msg.sender == owner, "somente o dono pode emitir tokens");// defeinimos aqui uma condição que somente o dono do contrato pode executar essa funcao, ou seja, quem fez o deploy que é representado pelo msg.sender

            // emissão de tokens para todos os apostadores
            for (uint i=0; i<stakers.length; i++) { // aqui soma e cadastra os apostadores dentro da array quando não for menor q zero, falamos que i(que seria representado pelo apostador) seria igual a zero inicialmente, e quando acresenta i(apostador) vai somanando, ou seja, como começa no 0 o segundo seria 1 o terceiro 2 e assim por diante
                address recipient = stakers[i]; // o endereco recebedor é o apostador dentro da array e cadastrado
                uint balance =stakingBalance[recipient]; //o saldo é igual o saldo do apostador recebedor
                if(balance > 0) { // se saldo maior que 0
                    dappToken.transfer(recipient, balance); // tarnfere o dappToken o recebedor e o saldo
                }
                
            }

        }
}


Feito as mudanças no contrato vamos implementá-las no arquivo de teste, TokenFarm.teste.js

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

As mudanças são da linha 101 até 117 onde é especificado as retiradas dos tokens. Feita as mudanças vamos executar no terminal o teste:
truffle test
teste das mudanças devem passar. 
Vamos criar um diretório de scripts, digite em seu terminal:
mkdir scripts/
touch scripts/issue-token.js
Agora temos no visual code a pasta sripts com o arquivo issue-token.js, insira nele o código:
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) { // arquivo em java que chama o contrato de tokenfarm para emitir os tokens
   
    //insira o codigo

    console.log("Tokens emitidos!")

    callback()
  }

Agora vamos executar no truffle o arquivo acima, digite no terminal ubuntu:
truffle exec scripts/issue-token.js
Com isso ele te dará o retorno da frase que inserimos no código: Tokens emitidos!
Com o sucesso da execução vamos agora inserir mais algumas coisas dentro do arquivo, issue-token.js

const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) { // arquivo em java que chama o contrato de tokenfarm para emitir os tokens
   let tokenFarm = await TokenFarm.deployed()
   await tokenFarm.issueTokens()

    //insira o codigo

    console.log("Tokens emitidos!")

    callback()
  }

Agora vamos executar no terminal a migração dos contratos e arquivos, em seu terminal:
truffle migrate --reset
Vamos ter o sequinte resultado:
 
Uma observação, sempre que formos executar truffle e compilar ou testar os contratos devemos estar com o ganache aberto, sendo que os arquivos usa o network id do mesmo, diferente do que aprendemos nas aulas do Moonbeam, que se trata de outra ferramenta usando polkadost e etc. Dessa forma, ao executar que o truffle migrate –reset, ele vai identificar o nome da rede e o id do ganache conforme imagem acima.
Vamos continuar, e execute novamente em seu terminal ubuntu o seguinte:
truffle exec scripts/issue-token.js
O resultado deve ser o mesmo que da outra vez, “Tokens emitidos!”
Pronto, sucesso. Vamos a próxima etapa.

FRONT END DOS CONFIGURAÇÃO 
(obs. Tive que refazer todas as etapas acima criando a pasta Depp2, sendo que havia dado um erro no front end, porém no Depp2 funcionou)
Agora vamos fazer o front end (frente) do nosso site, onde as pessoas interagem com o nosso contrato e podem comprar os tokens que criamos e apostar na fazenda. 
Vamos iniciar no terminal Ubuntu no diretório cd Depp2/defi_tutorial: (obs. Certifique-se que o ganache está aberto e rodando e deste modo vamos executar o código abaixo)
truffle migrate - - reset
Dessa forma migramos os contratos que estão nos arquivos e que fizemos, para rodar no server do ganache. 
Agora abra outro terminal do ubuntu, ou seja, tenha dois terminais aberto em sua maquina. Segue imagem:
 
No terminal novo abra os diretórios do curso:
cd Depp2
cd defi_tutorial
Feito isso execute:
npm run start

Porém, ao executar apareceu os seguinte erros:
 
Para solucionar, mas já corrigido eu fiz todas as etapas em um novo diretório chamado Depp2, sendo assim o passo a passo será usando o diretório Depp2, onde funcionou. Ao executar no terminal novo ubuntu nos diretórios do curso o código npm run start vamos repara que vai abrir no seu navegador um site e terá a mensagem de sucesso agora no seu terminal, conforme imagem abaixo:
 

Agora para entendermos a estrutura do site abra no visual code a pasta “src” e nos componentes dela terá o “App.js” e dentro dela você verá as definições do site:
 
Repare que há imposrtações de outras linguagens no mesmo arquivo como o react, logo abaixo uma “account” que ao abrir o site o numero indicado estará no canto superior a direita. Entendido isso, vamos seguir.
Vamos usar o framworking React, uma biblioteca que usa JavaScript para criar interface do usuário. Acesse o site https://pt-br.reactjs.org/ para conhecer mais, o site explica varias funcionalidades.
Repare agora no arquivo  “App.js” na linha 17 que faz referencia ao Navbar onde demonstra aspectos sobre a conta do contrato inteligente, ao entrar no arquivo ”Navbar.js” na linha 22 temos novamente a menção a conta.
Com isso, vamos usar web3.js – ethereum Javascript API para interagir. Confira a documentação no site https://web3js.readthedocs.io/en/v1.3.0/
Basicamente o web3 conecta a carteira do MetaMask.
Dessa forma vamos abrir o ganache e importar a segunda conta que seria do investidor para o nosso MetaMask, abara o ganache e copie do segundo endereço a sua chave privada conforme imagem abaixo:
 
Insira na importação de conta, no meu caso apareceu como account 7. Com isso, vc transfere a conta do ganache para fazer os testes.
Agora, vamos criar nossa rede ganache, abra no MetaMask na parte superior de Redes e vá na opção RPC personalizada.
Vá no ganache e copie o URL, no meu exemplo é:
HTTP://127.0.0.1:7545
ID 1337 (REPARE QUE AQUI ELE JÁ DA O ID CORRETO)
E crie a rede Ganache (nome que demos)
Conforme imagem:
 
Agora que criamos nossa rede Ganache que esta ligada as nossas contas do ganache aberto. (OBS. Repare que fizemos da mesma forma que o Monbeam e lá usamos a rede do Polkadost em outro site, conforme explicações iniciais). Agora com a rede Ganache aberta e o ganache também aberto vamos mudar alguns códigos no nosso Visual Code. (obs. Existe um artigo falando sobre o Metamask e sua aplicação web3.js, onde fala que os sites serão quebrados em 2021. https://medium.com/metamask/no-longer-injecting-web3-js-4a899ad6e59e )
No site https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md demonstra documentação e funcionalidades para serem implementadas caso queira fazer ERC20 token.
O site para solucionar a aplicação web3.js e com os códigos que devemos usar em apps para conectar o MetaMask em 2020 é: http://medium.com/@awantoch/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a aqui vamos encontrar a explicação e o passo a passo. (OBS. O SITE É BEM COMPLETO E ENSINA COISAS QUE APRENDEMOS AQUI NO PASSO A PASSO)
Entendido isso, vamos inserir o seguinte código no arquivo App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount(){ // ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0'
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Percebe que assim que você inserir o código acima e atualizar em seu visual code, automaticamente o site vai solicitar a conexão com a conta do MetaMask e você ira escolher uma das contas.
Vamos agora inserir mais alguns códigos no App.js :
import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    console.log(accounts)

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0'
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


(OBS; CASO DE ALGUM ERRO NO SEU SITE ABERTO FECHE O UBUNTU EM QUE VOCE EXECUTOU PARA ABRIR O SITE E TENTE NOVAMENTE, EXECUTANDO: npm run start )
Repare que inserimos algumas funções a mais em nosso código app, assim que modificar e executar você deve conferir no console de desenvolvedor do site se existe as modificações em especial a MetaMask: ‘ethereum.enable()’ onde logo abaixo deve constar exatamente a segunda conta do seu ganache, conforme imagem abaixo:
 
Que seria no caso a conta que está conectada no MEtaMask:
 
Repare que no próprio console da web demonstra a linha do código que executa a função de demonstrar a conta no console, do arquivo App.js, ou seja, linha 18.
Muuito bem, vamos continuar.. Tendo em vista o que falamos acima vamos modificar exatamente a função que retorna a conta no console web, no arquivo App.js entre outras modificações: (obs: as modificações são de componentes react todas pegas na biblioteca do site https://pt-br.reactjs.org/ ) 
Vamos inserir agora uma função para retornar no canto superior direito do site o numero da conta:
import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0'
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


O resultado deve ser o seguinte:
 
Agora vamos inserir para retornar o network ID do ganache, sendo ele 5777, para isso vamos modificar o arquivo APP.JS
import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    console.log(networkId)
  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Deve retornar o seguinte no site:
 
Continuando, agora vamos aprender baixar os contratos no site, vamos modificar novamente os códigos do App.js. (primeiramente será o contrato de DaiToken):


import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    console.log(networkId)

    //carregar contrato DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString()})
      console.log({ balance: daiTokenBalance }) // aqui definimos que deve retornar o valor
    } else {
      window.alert('DaiToken contrato não implantado na rede detectada')
    }
    

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Explicação: quando enviamos const daiToken = new web3... é porque estamos enviando o contrato em java script e o abi do mesmo é o endereço da conta nteworks que no caso o id seria 577, caso queira saber sobre o abi e todas as informações do DaiToken acesso a pasta “abis” e olhe o arquivo DaiToken.json. lá terá muitos códigos para entender mais a fundo. Repare também que sempre devemos colocar o import do diretório que queremos, no caso acima pegamos o contrato em java para executá-los no arquivo app.js e rodar na web3.
Destarte, em nosso código acima há a função web3.eth.Contract, objeto facilita a interação com contratos inteligentes no blockchain ethereum. Ao criar um novo objeto de contrato, você atribui a ele a interface json do respectivo contrato inteligente e o web3 converterá automaticamente todas as chamadas em chamadas ABI de baixo nível sobre RPC para você. Toda a explicação esta no site da documentação: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
(ACONSELHO OLHAR A DOCUMENTAÇÃO PARA QUE POSSA ENTENDER COMO INTERAGIR COM O CONTRATO NA WEB3)EXEMPLO DE METODOS USADOS PARA CHAMAR O CONTRATO NA WEB3: https://web3js.readthedocs.io/en/v1.3.0/web3-eth-contract.html#methods-mymethod-send 
 myContract.methods.myMethod([param1[, param2[, ...]]]).call(options [, defaultBlock] [, callback]) 

Para entender de forma mais detalhada confira no vídeo https://www.youtube.com/watch?v=XLahq4qyors no momento de 2:04:00 de vídeo em diante.
Ao inserir os códigos deve ter o seguinte resultado em seu site:
 
Desse modo, vamos inserir o código dos outros contratos, então modifique o arquivo App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    

    //carregar contrato DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString()})
      
    } else {
      window.alert('DaiToken contrato não implantado na rede detectada')
    }
    
     //carregar contrato DappToken
     const dappTokenData = DappToken.networks[networkId]
     if(dappTokenData) {
       const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
       this.setState({ dappToken })
       let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
       this.setState({ dappTokenBalance: dappTokenBalance.toString()})
       
     } else {
       window.alert('DappToken contrato não implantado na rede detectada')
     }

     //carregar contrato TokenFarm
     const tokenFarmData = TokenFarm.networks[networkId]
     if(tokenFarmData) {
       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
       this.setState({ tokenFarm })
       let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
       this.setState({ stakingBalance: stakingBalance.toString()})
       
     } else {
       window.alert('TokenFarm contrato não implantado na rede detectada')
     }

     this.setState({ loading: false })

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Repare que quando mudamos de rede no MetaMask de Ganache para outra rede sem ser ela aparece o alerta de window que definimos, ou seja, que o contrato não está implantado na rede detectada, sendo esta diferente da ganache, conforme a imagem:
 
Desta forma, sempre temos que estar na rede ganache que está implantado os referidos contratos. Com isso, conectamos os contratos em nosso FRONTEND e conectados na rede ganache blockchain.

Agora vamos fazer as pessoas interagirem com os contratos e blockchain pelo site. Desse modo vamos criar um arquivo em JavaScript, chamado Main.js dentro do diretório/pasta “components”. (OBS. Esse arquivo é para fazer o loyalt da pagina)
Main.js
import React, { Component } from 'react'


class Main extends Component {

  

  render() {
    return (
      <div>
         <h1>Hello, World!</h1>
      </div>
    );
  }
}

export default Main;

Perceba que o arquivo acima, por enquanto é simples e para desenvolver o site app, nele vamos retirar algumas funções do arquivo App.js e introduzi-las aqui, sendo que o arquivo App.js será somente para integrar os contratos e a rede de blockchain no site em questão. Com isso, no arquivo App.js cole o código:
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    

    //carregar contrato DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString()})
      
    } else {
      window.alert('DaiToken contrato não implantado na rede detectada')
    }
    
     //carregar contrato DappToken
     const dappTokenData = DappToken.networks[networkId]
     if(dappTokenData) {
       const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
       this.setState({ dappToken })
       let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
       this.setState({ dappTokenBalance: dappTokenBalance.toString()})
       
     } else {
       window.alert('DappToken contrato não implantado na rede detectada')
     }

     //carregar contrato TokenFarm
     const tokenFarmData = TokenFarm.networks[networkId]
     if(tokenFarmData) {
       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
       this.setState({ tokenFarm })
       let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
       this.setState({ stakingBalance: stakingBalance.toString()})
       
     } else {
       window.alert('TokenFarm contrato não implantado na rede detectada')
     }

     this.setState({ loading: false })

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

               <Main/>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Vamos entender, primeiramente no topo do código acima há a importação do nosso arquivo Main.js, import Main from './Main', para que agora consigamos através da importação fazer a página do site (obs. O arquivo App.js é o backand (por tras) do site). Perceba que no final do arquivo App.js onde existia a mensagem “Hello, World!” não tem mais, e sim no lugar dela o <Main/> que indica agora que o código referente ao “loyalt” do frontend será feito no arquivo Main.js.

Entendido isso, vamos continuar agora vamos modificar mais ainda o arquivo em App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    

    //carregar contrato DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString()})
      
    } else {
      window.alert('DaiToken contrato não implantado na rede detectada')
    }
    
     //carregar contrato DappToken
     const dappTokenData = DappToken.networks[networkId]
     if(dappTokenData) {
       const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
       this.setState({ dappToken })
       let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
       this.setState({ dappTokenBalance: dappTokenBalance.toString()})
       
     } else {
       window.alert('DappToken contrato não implantado na rede detectada')
     }

     //carregar contrato TokenFarm
     const tokenFarmData = TokenFarm.networks[networkId]
     if(tokenFarmData) {
       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
       this.setState({ tokenFarm })
       let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
       this.setState({ stakingBalance: stakingBalance.toString()})
       
     } else {
       window.alert('TokenFarm contrato não implantado na rede detectada')
     }

     this.setState({ loading: false })

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id= "loader" className="text-center">Loading...</p>
    }else{
      content = <Main/>
    }
    
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

               {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

Inserimos aqui os códigos para fazer o loading da página, recarregando as contas e o MetMask.
Vamos continuar editando o arquivo App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    

    //carregar contrato DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString()})
      
    } else {
      window.alert('DaiToken contrato não implantado na rede detectada')
    }
    
     //carregar contrato DappToken
     const dappTokenData = DappToken.networks[networkId]
     if(dappTokenData) {
       const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
       this.setState({ dappToken })
       let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
       this.setState({ dappTokenBalance: dappTokenBalance.toString()})
       
     } else {
       window.alert('DappToken contrato não implantado na rede detectada')
     }

     //carregar contrato TokenFarm
     const tokenFarmData = TokenFarm.networks[networkId]
     if(tokenFarmData) {
       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
       this.setState({ tokenFarm })
       let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
       this.setState({ stakingBalance: stakingBalance.toString()})
       
     } else {
       window.alert('TokenFarm contrato não implantado na rede detectada')
     }

     this.setState({ loading: false }) //aqui é definido o estado do site e o carregamento dele

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id= "loader" className="text-center">Loading...</p>
    }else{
      content = <Main
      daiTokenBalance={this.state.daiTokenBalance}
      dappTokenBalance={this.state.dappTokenBalance}
      stakingBalance={this.state.stakingBalance}
      stakeTokens={this.stakeTokens}
  
      />
    }
    
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

               {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Repare aqui, colocamos em “contente = <Main” todos os saldos relativos aos contratos. 
Agora vamos modificar o código Main.js
import React, { Component } from 'react'


class Main extends Component {

  

  render() {
    return (
        <div id="content" className="mt-3">
         <table className="table table-borderless tesxt-muted text-center">
           <thead>
             <tr>
               <th scope="col">Saldo Apostador</th> 
               <th scope="col">Saldo de recompensa</th>
               </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} DAPP</td>
                  </tr>
                </tbody>
           </table>
      </div>
    );
  }
}

export default Main;
De forma resumida criamos uma função table que classifica os saldos tanto do apostador quanto da recompensa. E retorna na web3 os valores em wei convertidos de ether dos Tokens mDAI e DAPP.
Vamos inserir agora um botão para apostar tokens mDAI e além de termos os saldos na parte superior do site em que os apostadores possam interagir e saber os saldos da sua carteira e também o de aposta, com isso o site começa a tomar forma no arquivo Main.js
import React, { Component } from 'react'
import dai from '../dai.png' //importamos aqui a foto

class Main extends Component {

  

  render() {
    return (
        <div id="content" className="mt-3">

         <table className="table table-borderless tesxt-muted text-center">
           <thead>
             <tr>
               <th scope="col">Saldo Apostador</th> 
               <th scope="col">Saldo de recompensa</th>
               </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} DAPP</td>
                  </tr>
                </tbody>
           </table>

           <div className="card mb-4">

           <div  className="card-body">
             
             <form className="mb-3">
               <div> 
                <label className="float-left"><b>Tokens de Aposta</b></label>
                <span className="float-right text-muted">
                 Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                   type = "text"
                   className="form-control form-control-lg"
                   placeholder="0"
                   required />
            <div className= "input-group-append">
              <div className="input-group-text">
                <img src={dai} height='32' alt=""/>
                &nbsp;&nbsp;&nbsp;mDAI
                </div>
              </div>
            </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">APOSTAR!</button>
            </form>



            </div>
            </div>

      </div>
    );
  }
}

export default Main;

O site deve ficar da seguinte forma:
 
Repare que há um botão agora e a imagem que importamos no código está no site. Além disso, você pode inserir valores dentro da caixa de tokens de Aposta.
Deste modo, vamos seguir em frente. Agora vamos modificar os dois arquivos e explicando as modificações. Primeiro o Main.js
import React, { Component } from 'react'
import dai from '../dai.png' //importamos aqui a foto

class Main extends Component {

  

  render() {
    return (
        <div id="content" className="mt-3">

         <table className="table table-borderless tesxt-muted text-center">
           <thead>
             <tr>
               <th scope="col">Saldo Apostador</th> 
               <th scope="col">Saldo de recompensa</th>
               </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} DAPP</td>
                  </tr>
                </tbody>
           </table>

           <div className="card mb-4">

           <div  className="card-body">
             
             <form className="mb-3" onSubmit={(event)=> {
               event.preventDefault()
               let amount
               amount = this.input.value.toString() //esta ligado ao input dos códigos abaixo
               amount = window.web3.utils.toWei(amount, 'Ether')
               this.props.stakeTokens(amount)
             }}>
               <div> 
                <label className="float-left"><b>Tokens de Aposta</b></label>
                <span className="float-right text-muted">
                 Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                   type = "text"
                   ref={(input)=> {this.input = input}} // aqui siginifica que o valor que colocarmos dentro da caixa de tokens de aposta será retirado do monstante (amount) e acrescido no valor
                   className="form-control form-control-lg"
                   placeholder="0"
                   required />
            <div className= "input-group-append">
              <div className="input-group-text">
                <img src={dai} height='32' alt=""/>
                &nbsp;&nbsp;&nbsp;mDAI
                </div>
              </div>
            </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">APOSTAR!</button>
            </form>



            </div>
            </div>

      </div>
    );
  }
}

export default Main;

Agora modifique o App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    

    //carregar contrato DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString()})
      
    } else {
      window.alert('DaiToken contrato não implantado na rede detectada')
    }
    
     //carregar contrato DappToken
     const dappTokenData = DappToken.networks[networkId]
     if(dappTokenData) {
       const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
       this.setState({ dappToken })
       let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
       this.setState({ dappTokenBalance: dappTokenBalance.toString()})
       
     } else {
       window.alert('DappToken contrato não implantado na rede detectada')
     }

     //carregar contrato TokenFarm
     const tokenFarmData = TokenFarm.networks[networkId]
     if(tokenFarmData) {
       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
       this.setState({ tokenFarm })
       let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
       this.setState({ stakingBalance: stakingBalance.toString()})
       
     } else {
       window.alert('TokenFarm contrato não implantado na rede detectada')
     }

     this.setState({ loading: false }) //aqui é definido o estado do site e o carregamento dele

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address,amount).send({from: this.state.account}).on('transactionHash', (hash)=> {
      this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on('trasactionHash', (hash)=> {
        this.setState({loading: false})
      })
    })
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id= "loader" className="text-center">Loading...</p>
    }else{
      content = <Main
      daiTokenBalance={this.state.daiTokenBalance}
      dappTokenBalance={this.state.dappTokenBalance}
      stakingBalance={this.state.stakingBalance}
      stakeTokens={this.stakeTokens}
  
      />
    }
    
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

               {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Primeiramente modificamos o arquivo Main.js, onde inserimos onde se coloca o submit, ou seja, o input dos valores e lá é convertido para wei. Já no arquivo App.js que se encontra todo o código que liga ao blockchain (ganache) e aos contratos inserimos o código relativo ao Token de aposta que seria o stakeTokens, nele exercemos funções de aprovação da transação e balanço da conta. Deve aparecer o seguinte em seu site assim que você inserir, por exemplo, um valor de 100 mDAI de token de aposta:
 
Repare que pergunta se você confia no site e se deseja realmente fazer a transação. Confirme e continue a transação e verá que depois disso terá em sua conta 100 mDAI token referente ao valor que efetuou a compra. Conforme imagem:
 
Em conseguinte:
 
Ao atualizar a página:
 
Repare que há o saldo do apostador. (OBS. No exemplo acima repare que no mDAI e DAPP existem os saldos de 100, porém isso aconteceu por conta de um erro de digitação no meu código, onde há o código 
<td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                   <td>{window.web3.utils.fromWei(this.props. stakingBalance, 'Ether')} DAPP</td>

Havia repetido o stakingBalance no código, sendo o correto dappTokenBalance, para que o token DAPP retorne o valore correto. Desta forma o código abaixo está correto)
Agora vamos criar um botão de retirar a aposta, insira o código do Main.js (OBS. Repare as modificações)
import React, { Component } from 'react'
import dai from '../dai.png' //importamos aqui a foto

class Main extends Component {

  

  render() {
    return (
        <div id="content" className="mt-3">

         <table className="table table-borderless tesxt-muted text-center">
           <thead>
             <tr>
               <th scope="col">Saldo Apostador</th> 
               <th scope="col">Saldo de recompensa</th>
               </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                   <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
                  </tr>
                </tbody>
           </table>

           <div className="card mb-4">

           <div  className="card-body">
             
             <form className="mb-3" onSubmit={(event)=> {
               event.preventDefault()
               let amount
               amount = this.input.value.toString() //esta ligado ao input dos códigos abaixo
               amount = window.web3.utils.toWei(amount, 'Ether')
               this.props.stakeTokens(amount)
             }}>
               <div> 
                <label className="float-left"><b>Tokens de Aposta</b></label>
                <span className="float-right text-muted">
                 Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                   type = "text"
                   ref={(input)=> {this.input = input}} // aqui siginifica que o valor que colocarmos dentro da caixa de tokens de aposta será retirado do monstante (amount) e acrescido no valor
                   className="form-control form-control-lg"
                   placeholder="0"
                   required />
            <div className= "input-group-append">
              <div className="input-group-text">
                <img src={dai} height='32' alt=""/>
                &nbsp;&nbsp;&nbsp;mDAI
                </div>
              </div>
            </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">APOSTAR!</button>  
            </form>
            <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) =>{
              event.preventDefault()
              this.props.unstakeTokens()
            }}>
              RETIRAR APOSTA..
              </button>


            </div>
            </div>

      </div>
    );
  }
}

export default Main;

 Agora vamos modificar o App.js que está ligado diretamente as carteiras que efetuaram a aposta e que fazem o deposito da aposta. App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount(){ // componentWillMount componetnWillMount ao chamar ess funçao irá fazer o dawlosd do web3 abaixo
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]}) // função que determina que deve demonstrar o numero da conta

    const networkId = await web3.eth.net.getId()
    

    //carregar contrato DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString()})
      
    } else {
      window.alert('DaiToken contrato não implantado na rede detectada')
    }
    
     //carregar contrato DappToken
     const dappTokenData = DappToken.networks[networkId]
     if(dappTokenData) {
       const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
       this.setState({ dappToken })
       let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
       this.setState({ dappTokenBalance: dappTokenBalance.toString()})
       
     } else {
       window.alert('DappToken contrato não implantado na rede detectada')
     }

     //carregar contrato TokenFarm
     const tokenFarmData = TokenFarm.networks[networkId]
     if(tokenFarmData) {
       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
       this.setState({ tokenFarm })
       let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
       this.setState({ stakingBalance: stakingBalance.toString()})
       
     } else {
       window.alert('TokenFarm contrato não implantado na rede detectada')
     }

     this.setState({ loading: false }) //aqui é definido o estado do site e o carregamento dele

  }

  // a função abaixo faz conexão com o blockchain

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider tryng MetaMask! - Navegador não Ethereum detectado. Você deve considerar tentar MetaMask')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address,amount).send({from: this.state.account}).on('transactionHash', (hash)=> {
      this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on('trasactionHash', (hash)=> {
        this.setState({loading: false})
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
      this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account}).on('trasactionHash', (hash)=> {
        this.setState({loading: false})
      })
  }

  constructor(props) { //aqui vamos executar todos os contratos que fizemos e seus saldos, inseridos no State da função acima
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance:'0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id= "loader" className="text-center">Loading...</p>
    }else{
      content = <Main
      daiTokenBalance={this.state.daiTokenBalance}
      dappTokenBalance={this.state.dappTokenBalance}
      stakingBalance={this.state.stakingBalance}
      stakeTokens={this.stakeTokens}
      unstakeTokens={this.unstakeTokens}
  
      />
    }
    
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

               {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


Deste modo, deve ter o seguinte resultado:
 
Na imagem acima eu já havia feito a retirada, caso você ainda possua 100 mDAI no saldo apostador, clique em RETIRAR APOSTA que deverá zerar esses valores, bem como voltar em balance o valor de 100.
Continuando...
Abra uma aba nova do UBUNTU e dentro da pasta Depp2 e defi_tutorial execute os seguinte em seu terminal:
truffle exec scripts/issue-token.js
Deve aparecer a mensagem de Tokens emitidos.
Agora atualize a pagina do site e deve aparecer o seguinte:
 
Repare que agora houve a recompensa de DAPP equivalentes a 100 após executar a emissão de tokens no truffle exec.
Feito isso execute novamente:
truffle exec scripts/issue-token.js
Atualize o site e terá como saldo de recompensa 200 DAPP, conforme imagem:
 
Agora faça a retirada dos tokens de aposta, repare que ao retirar a recompensa deve continuar. Afinal, enquanto o usuário apostou ele teve sua recompensa sobre sua aposta, não podendo perdê-la. Dessa forma ao retirar a aposta deve ficar da seguinte forma:
 
Muito bem, agora você tem um site de apostas em uma ‘fazenda” que da recompensa em tokens e os usuários apostam em mDAP.

