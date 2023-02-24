
const AlienWorldzMaxTokensPerUser = 50;
const AlienWorldzLocalhostNetwork = "localhost";
const AlienWorldzMumbaiNetwork = "mumbai";
const AlienWorldzRinkebyNetwork = "rinkeby";
const AlienWorldzPolygonNetwork = "Polygon Mainnet"; // polygon

// Change this to control which environment you're pointing at.
const currentNetwork = AlienWorldzLocalhostNetwork;
// const currentNetwork = AlienWorldzMumbaiNetwork;
// const currentNetwork = AlienWorldzRinkebyNetwork;
// const currentNetwork = AlienWorldzPolygonNetwork;

const AlienWorldzCurrentNetworkIDKey = "AlienWorldzCurrentNetworkIDKey";
const AlienWorldzCurrentNetworkNameKey = "AlienWorldzCurrentNetworkNameKey";
const AlienWorldzCurrentNetworkCurrencySymbolKey = "AlienWorldzCurrentNetworkCurrencySymbolKey";
const AlienWorldzCurrentNetworkRpcUrlKey = "AlienWorldzCurrentNetworkRpcUrlKey";
const AlienWorldzCurrentNetworkExplorerUrlKey = "AlienWorldzCurrentNetworkExplorerUrlKey";
const AlienWorldzContractAddressKey = "AlienWorldzContractAddressKey";


const networkConfig = networkConfigFor(currentNetwork);
const AlienWorldzCurrentNetworkID = networkConfig[AlienWorldzCurrentNetworkIDKey];
const AlienWorldzCurrentNetworkName = networkConfig[AlienWorldzCurrentNetworkNameKey];
const AlienWorldzCurrentNetworkCurrencySymbol = networkConfig[AlienWorldzCurrentNetworkCurrencySymbolKey];
const AlienWorldzCurrentNetworkRpcUrl = networkConfig[AlienWorldzCurrentNetworkRpcUrlKey];
const AlienWorldzCurrentNetworkExplorerUrl = networkConfig[AlienWorldzCurrentNetworkExplorerUrlKey];
const AlienWorldzContractAddress = networkConfig[AlienWorldzContractAddressKey];

function networkConfigFor(currentNetwork) { 
    if (currentNetwork === AlienWorldzLocalhostNetwork) {
        return {
            AlienWorldzCurrentNetworkIDKey: 1337, 
            AlienWorldzCurrentNetworkNameKey: "localhost",
            AlienWorldzCurrentNetworkCurrencySymbolKey: "ETH",
            AlienWorldzCurrentNetworkRpcUrlKey: "",
            AlienWorldzCurrentNetworkExplorerUrlKey: 'https://www.superbad.com/',
            AlienWorldzContractAddressKey: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
        }    
    } else if (currentNetwork === AlienWorldzMumbaiNetwork) {
        return {
            AlienWorldzCurrentNetworkIDKey: 80001,
            AlienWorldzCurrentNetworkNameKey: "Matic Mumbai",
            AlienWorldzCurrentNetworkCurrencySymbolKey: "MATIC",
            AlienWorldzCurrentNetworkRpcUrlKey: "https://rpc-mumbai.maticvigil.com/",
            AlienWorldzCurrentNetworkExplorerUrlKey: "https://mumbai.polygonscan.com/",
            AlienWorldzContractAddressKey: '0x694b0dC535c38bee5f168b753B60dd79AC12cc1a' //pre-opensea support: '0xfE5b53733fA92D335e08dAe84fC98f98Fb8BD535'
        }
    } else if (currentNetwork === AlienWorldzPolygonNetwork) {
        return {
            AlienWorldzCurrentNetworkIDKey: 137, 
            AlienWorldzCurrentNetworkNameKey: "Polygon Mainnet",
            AlienWorldzCurrentNetworkCurrencySymbolKey: "MATIC",
            AlienWorldzCurrentNetworkRpcUrlKey: "https://rpc-mainnet.maticvigil.com/",
            AlienWorldzCurrentNetworkExplorerUrlKey: 'https://www.polygonscan.com/',
            AlienWorldzContractAddressKey: '0x9F5C4Ea4d13339D2379412141268032DD9bC7329'
        }        
    } else if (currentNetwork === AlienWorldzRinkebyNetwork) {
        return {
            AlienWorldzCurrentNetworkIDKey: 4, 
            AlienWorldzCurrentNetworkNameKey: "rinkeby",
            AlienWorldzCurrentNetworkCurrencySymbolKey: "ETH",
            AlienWorldzCurrentNetworkRpcUrlKey: "https://rinkeby.infura.io/v3/",
            AlienWorldzCurrentNetworkExplorerUrlKey: 'https://rinkeby.etherscan.io/',
            AlienWorldzContractAddressKey: '0x10eF52f63160E3526cb85997169d25D2f5cD7514'
        }
    }
}

// ETHEREUM

// Rinkeby
// const AlienWorldzCurrentNetworkID = 4; 
// const AlienWorldzCurrentNetworkName = "Rinkeby Testnet";
// const AlienWorldzContractAddress = '0x95C2274aCC5B0AEc7d1544d71CF4620124f6ec1c';
// const AlienWorldzCurrentNetworkExplorerUrl = 'https://rinkeby.etherscan.io/'; 

// Ropsten
// const AlienWorldzCurrentNetworkID = 3; 
// const AlienWorldzCurrentNetworkName = "Ropsten Testnet";
// const AlienWorldzContractAddress = '0x379A3dA759A131504085E485a75cA2202fB80476'; 
// const AlienWorldzCurrentNetworkExplorerUrl = 'https://ropsen.etherscan.io/'; 

// Mainnet
// const AlienWorldzCurrentNetworkID = 1; 
// const AlienWorldzCurrentNetworkName = "Ethereum Mainnet";
// const AlienWorldzContractAddress = '0xeD03568eaC21c1D0316c87cC09c0ce85f0000c65'; 
// const AlienWorldzCurrentNetworkExplorerUrl = 'https://www.etherscan.io/';

// POLYGON


export { AlienWorldzMaxTokensPerUser,
         AlienWorldzCurrentNetworkID, 
         AlienWorldzCurrentNetworkName, 
         AlienWorldzCurrentNetworkCurrencySymbol, 
         AlienWorldzCurrentNetworkRpcUrl,
         AlienWorldzCurrentNetworkExplorerUrl };

export default AlienWorldzContractAddress;
