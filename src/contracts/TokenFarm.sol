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

