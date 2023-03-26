
const CosmicWorldsMaxTokensPerUser = 50;
const CosmicWorldsLocalhostNetwork = "localhost";
const CosmicWorldsMumbaiNetwork = "mumbai";
const CosmicWorldsPolygonNetwork = "Polygon Mainnet"; // polygon

// Change this to control which environment you're pointing at.
const currentNetwork = CosmicWorldsLocalhostNetwork;
// const currentNetwork = CosmicWorldsMumbaiNetwork;
// const currentNetwork = CosmicWorldsPolygonNetwork;

const CosmicWorldsCurrentNetworkIDKey = "CosmicWorldsCurrentNetworkIDKey";
const CosmicWorldsCurrentNetworkNameKey = "CosmicWorldsCurrentNetworkNameKey";
const CosmicWorldsCurrentNetworkCurrencySymbolKey = "CosmicWorldsCurrentNetworkCurrencySymbolKey";
const CosmicWorldsCurrentNetworkRpcUrlKey = "CosmicWorldsCurrentNetworkRpcUrlKey";
const CosmicWorldsCurrentNetworkExplorerUrlKey = "CosmicWorldsCurrentNetworkExplorerUrlKey";
const CosmicWorldsContractAddressKey = "CosmicWorldsContractAddressKey";


const networkConfig = networkConfigFor(currentNetwork);
const CosmicWorldsCurrentNetworkID = networkConfig[CosmicWorldsCurrentNetworkIDKey];
const CosmicWorldsCurrentNetworkName = networkConfig[CosmicWorldsCurrentNetworkNameKey];
const CosmicWorldsCurrentNetworkCurrencySymbol = networkConfig[CosmicWorldsCurrentNetworkCurrencySymbolKey];
const CosmicWorldsCurrentNetworkRpcUrl = networkConfig[CosmicWorldsCurrentNetworkRpcUrlKey];
const CosmicWorldsCurrentNetworkExplorerUrl = networkConfig[CosmicWorldsCurrentNetworkExplorerUrlKey];
const CosmicWorldsContractAddress = networkConfig[CosmicWorldsContractAddressKey];

function networkConfigFor(currentNetwork) { 
    if (currentNetwork === CosmicWorldsLocalhostNetwork) {
        return {
            CosmicWorldsCurrentNetworkIDKey: 1337, 
            CosmicWorldsCurrentNetworkNameKey: "localhost",
            CosmicWorldsCurrentNetworkCurrencySymbolKey: "ETH",
            CosmicWorldsCurrentNetworkRpcUrlKey: "http://localhost:8545",
            CosmicWorldsCurrentNetworkExplorerUrlKey: 'https://www.superbad.com/',
            CosmicWorldsContractAddressKey: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
        }    
    } else if (currentNetwork === CosmicWorldsMumbaiNetwork) {
        return {
            CosmicWorldsCurrentNetworkIDKey: 80001,
            CosmicWorldsCurrentNetworkNameKey: "Matic Mumbai",
            CosmicWorldsCurrentNetworkCurrencySymbolKey: "MATIC",
            CosmicWorldsCurrentNetworkRpcUrlKey: "https://rpc-mumbai.maticvigil.com/",
            CosmicWorldsCurrentNetworkExplorerUrlKey: "https://mumbai.polygonscan.com/",
            CosmicWorldsContractAddressKey: '0x694b0dC535c38bee5f168b753B60dd79AC12cc1a' //pre-opensea support: '0xfE5b53733fA92D335e08dAe84fC98f98Fb8BD535'
        }
    } else if (currentNetwork === CosmicWorldsPolygonNetwork) {
        return {
            CosmicWorldsCurrentNetworkIDKey: 137, 
            CosmicWorldsCurrentNetworkNameKey: "Polygon Mainnet",
            CosmicWorldsCurrentNetworkCurrencySymbolKey: "MATIC",
            CosmicWorldsCurrentNetworkRpcUrlKey: "https://rpc-mainnet.maticvigil.com/",
            CosmicWorldsCurrentNetworkExplorerUrlKey: 'https://www.polygonscan.com/',
            CosmicWorldsContractAddressKey: '0x9F5C4Ea4d13339D2379412141268032DD9bC7329'
        }        
    }
}

// ETHEREUM

// Mainnet
// const CosmicWorldsCurrentNetworkID = 1; 
// const CosmicWorldsCurrentNetworkName = "Ethereum Mainnet";
// const CosmicWorldsContractAddress = '0xeD03568eaC21c1D0316c87cC09c0ce85f0000c65'; 
// const CosmicWorldsCurrentNetworkExplorerUrl = 'https://www.etherscan.io/';

// POLYGON


export { CosmicWorldsMaxTokensPerUser,
         CosmicWorldsCurrentNetworkID, 
         CosmicWorldsCurrentNetworkName, 
         CosmicWorldsCurrentNetworkCurrencySymbol, 
         CosmicWorldsCurrentNetworkRpcUrl,
         CosmicWorldsCurrentNetworkExplorerUrl };

export default CosmicWorldsContractAddress;
