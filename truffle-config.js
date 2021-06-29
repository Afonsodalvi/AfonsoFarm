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
