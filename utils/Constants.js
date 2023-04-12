
const CosmicWorldsMaxTokensPerUser = 50;
const CosmicWorldsLocalhostNetwork = "localhost";
const CosmicWorldSepoliaNetwork = "sepolia";
const CosmicWorldMainnetNetwork = "mainnet";

// Change this to control which environment you're pointing at.
const currentNetwork = CosmicWorldsLocalhostNetwork;
// const currentNetwork = CosmicWorldMainnetNetwork;

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
    } else if (currentNetwork === CosmicWorldSepoliaNetwork) {
        return {
            CosmicWorldsCurrentNetworkIDKey: 11155111,
            CosmicWorldsCurrentNetworkNameKey: "Sepolia",
            CosmicWorldsCurrentNetworkCurrencySymbolKey: "SepoliaETH",
            // TODO: RPC URL
            CosmicWorldsCurrentNetworkRpcUrlKey: "",
            CosmicWorldsCurrentNetworkExplorerUrlKey: "https://sepolia.etherscan.io/",
            CosmicWorldsContractAddressKey: ""
        }        
    } else if (currentNetwork === CosmicWorldMainnetNetwork) {
        return {
            CosmicWorldsCurrentNetworkIDKey: 1,
            CosmicWorldsCurrentNetworkNameKey: "Ethereum Mainnet",
            CosmicWorldsCurrentNetworkCurrencySymbolKey: "ETH",
            // TODO: RPC URL
            CosmicWorldsCurrentNetworkRpcUrlKey: "",
            CosmicWorldsCurrentNetworkExplorerUrlKey: "https://www.etherscan.io/",
            CosmicWorldsContractAddressKey: ""
        }        
    }
}

export { CosmicWorldsMaxTokensPerUser,
         CosmicWorldsCurrentNetworkID, 
         CosmicWorldsCurrentNetworkName, 
         CosmicWorldsCurrentNetworkCurrencySymbol, 
         CosmicWorldsCurrentNetworkRpcUrl,
         CosmicWorldsCurrentNetworkExplorerUrl,
         CosmicWorldsContractAddress
         };
