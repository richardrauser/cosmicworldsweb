
import { ethers } from 'ethers';
import CosmicWorlds from '../contract/CosmicWorlds.json';
import * as Errors from './ErrorMessages';
import { CosmicWorldsContractAddress, CosmicWorldsCurrentNetworkID, CosmicWorldsCurrentNetworkName, CosmicWorldsCurrentNetworkCurrencySymbol, CosmicWorldsCurrentNetworkRpcUrl, CosmicWorldsCurrentNetworkExplorerUrl } from './Constants';
import { showInfoMessage } from './UIUtils';
import{ handleError } from './ErrorHandler';
import detectEthereumProvider from '@metamask/detect-provider'
import { formatEther } from 'ethers';

// import Web3Modal from "web3modal";

const AccountDetailsKey = "DS_ACCOUNT_DETAILS_KEY";

async function getProvider(browserProvider) {

  if (browserProvider === false) {
    // this will be readonly as it is not connected to a browser's ethereum wallet.
    // TODO: specify URLS from infura, etc to get this working: https://docs.ethers.org/v6/getting-started/#starting-connecting
    console.log("Returning default provider..");
    // if (CosmicWorldsCurrentNetworkName == "localhost") {
    //   return ethers.getDefaultProvider("http://127.0.0.1:8545/");
    // } else {
    //   return new ethers.JsonRpcProvider(CosmicWorldsCurrentNetworkRpcUrl);
    // }
  }

  if (!window.ethereum) {
    console.log('No Ethereum wallet found. Throwing error NO_ETH_WALLET');
    throw Error(Errors.DS_NO_ETH_WALLET);
  }  
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  
  console.log("Desired chain ID: " + CosmicWorldsCurrentNetworkID);
  console.log("Current chain ID: " + network.chainId);
  
  if (!network.chainId == CosmicWorldsCurrentNetworkID) {
    throw Error(Errors.DS_WRONG_ETH_NETWORK);
  }

  console.log("Returning browser provider..");
  return provider;
}

export async function switchToCurrentNetwork() {
   // will attempt to add current network, behaviour is to switch if already present in MetaMask
  console.log("Switching to " + CosmicWorldsCurrentNetworkName + "...");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (network.chainId == CosmicWorldsCurrentNetworkID) {
    showInfoMessage("You're already on the " + CosmicWorldsCurrentNetworkName + " network. Yay.");
    return;
  }

  const data = [{
    chainId: "0x" + CosmicWorldsCurrentNetworkID.toString(16),
    chainName: CosmicWorldsCurrentNetworkName,
    nativeCurrency:
        {
            name: CosmicWorldsCurrentNetworkCurrencySymbol,
            symbol: CosmicWorldsCurrentNetworkCurrencySymbol,
            decimals: 18
        },
    rpcUrls: [CosmicWorldsCurrentNetworkRpcUrl],
    blockExplorerUrls: [CosmicWorldsCurrentNetworkExplorerUrl],
  }];

  console.log (data);
  
  const tx = await window.ethereum.request({method: 'wallet_addEthereumChain', params:data});
  if (tx) {
      console.log(tx)
  }
}

export async function getReadOnlyContract() {
  console.log("Getting read-only contract..");
  const provider = await getProvider(true);
    
  console.log("CONTRACT ADDRESS: " + CosmicWorldsContractAddress);
  
  return new ethers.Contract(CosmicWorldsContractAddress, CosmicWorlds.abi, provider);
}

export async function getReadWriteContract() {
  console.log("Getting read/write contract..");
  const provider = await getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(CosmicWorldsContractAddress, CosmicWorlds.abi, signer);
}

export async function isAccountConnected() {
  const provider = await getProvider();
  const [account] = await provider.listAccounts();

  console.log("isAccountConnected, account: " + account);
  if (account === undefined || account === null) {
    return false;
  }
  return true;
}

export async function fetchAccount() {

  console.log("Fetching account..");
  const provider = await getProvider();
  // var [account] = await provider.listAccounts();
  var account = await provider.account;

  console.log("GOT ACCOUNT: " + account);
  if (account === undefined || account === null)  {
    [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    console.log("ACCOUNT FROM ETH_REQUESTACCOUNTS: " + account);    
  }

  if (account === undefined || account === null) {
    throw Error(Errors.DS_NO_ETH_ACCOUNT);
  }
  return account;
}

export async function fetchAccountDetails() {
  console.log("Fetching account details from blockchain..");
    
  const account = await fetchAccount();
  const provider = await getProvider();

  const fullAddress = account.toString();
  var shortenedAddress = fullAddress;
  console.log("Getting details of account: " + fullAddress); 

  if (shortenedAddress.length > 10) {
    shortenedAddress = shortenedAddress.substring(0, 6) +  "..." + shortenedAddress.slice(-4);        
  }

  const weiBalance = await provider.getBalance(account);
  const displayBalance = Number(formatEther(weiBalance)).toFixed(4);

  var accountDetails = new AccountDetails(shortenedAddress, fullAddress, weiBalance.toString(), displayBalance.toString());

  localStorage.setItem(AccountDetailsKey, JSON.stringify(accountDetails));

  fetchCachedAccountDetails();

  return accountDetails;
}

export function fetchCachedAccountDetails() {
  const accountDetails = JSON.parse(localStorage.getItem(AccountDetailsKey));
  
  if (accountDetails === null) {
    console.log("details are null.");
     return null;
  }

  if (accountDetails.shortenedAddress === undefined || accountDetails.fullAddress === undefined || accountDetails.weiBalance === undefined || accountDetails.displayBalance === undefined) {
    console.log("some element of details is null. " + accountDetails);
    console.log("shortened address: " + accountDetails.shortenedAddress);
    console.log("full address: " + accountDetails.fullAddress);
    console.log("wei balance: " + accountDetails.weiBalance);
    console.log("display balance " + accountDetails.displayBalance);
    clearCachedAccountDetails();
    return null;
  } else {
    return accountDetails;
  }
}

export function clearCachedAccountDetails() {
  localStorage.removeItem(AccountDetailsKey);
}

class AccountDetails {
  constructor(shortenedAddress, fullAddress, weiBalance, displayBalance) {
    this.shortenedAddress = shortenedAddress;
    this.fullAddress = fullAddress;
    this.weiBalance = weiBalance;
    this.displayBalance = displayBalance; // ETH
  }
}
  

// export async function isCurrentAccountOwner() {
//   console.log("Checking current account owner status..");

//   const connected = await isAccountConnected();
//   if (!connected) {
//     console.log("NOT CONNECTED.");
//     return false;
//   }

//   const account = await fetchAccount();

//   const ethAddress = account.toString().toLowerCase();
//   const contract = await getReadOnlyContract();
//   const ownerAddress = (await contract.owner()).toString().toLowerCase();
//   console.log("connected account address: " + ethAddress);
//   console.log("owner address: " + ownerAddress);

//   return (ethAddress === ownerAddress);
// } 

export async function mintTenCosmicWorlds() {
  console.log("Minting 10 Cosmic Worlds..");

  const contract = await getReadWriteContract(); 
  
  const overrides = {
    gasLimit: 580000
  };
  
  var seeds = [];

  for (let i = 0; i < 10; i++) {
      console.log(`Generating seed ${i}...`);
      const seed = Math.trunc(Math.random() * 5_000_000);
      seeds.push(seed);
  }

  const transaction = await contract.mintMany(seeds, overrides);
  console.log("Tx hash: " + transaction.hash);
}

export async function mintCosmicWorld(randomSeed) {
    console.log("Minting Cosmic World with seed: " + randomSeed);
  
    const contract = await getReadWriteContract(); 
    
    const overrides = {
      gasLimit: 180000
    };
    
    console.log("!!!!!");

    const transaction = await contract.mint(randomSeed, overrides);
    console.log("Tx hash: " + transaction.hash);
} 

export async function fetchTokenDetails(tokenId) {

  console.log("Getting metadata for token ID: " + tokenId);
  
    if (tokenId === undefined || tokenId === null) {
      console.log("No token ID!");
      return;
    }
    const contract = await getReadOnlyContract();
    const metadataDataUri = await contract.tokenURI(tokenId);
    var metadataJson = "";

    if (metadataDataUri.startsWith("data:text/plain,")) {
      metadataJson = metadataDataUri.replace("data:text/plain,", "");          
    } else if (metadataDataUri.startsWith("data:application/json,")) {
      metadataJson = metadataDataUri.replace("data:application/json,", "");          
    } else if (metadataDataUri.startsWith("data:application/json;base64,")) {
      const metadataJsonBase64Encoded = metadataDataUri.replace("data:application/json;base64,", "");          
      let buffer = new Buffer(metadataJsonBase64Encoded, 'base64');

      metadataJson = buffer.toString('utf-8');
    }

    // console.log("METADATA: " + metadataJson);

    const metadataObject = JSON.parse(metadataJson);

    const svg = metadataObject.image.replace("data:image/svg+xml,", "");
    const encodedSvg = encodeURIComponent(svg);
    const svgDataUri = `data:image/svg+xml,${encodedSvg}`;

    // console.log("SVG: " + svg);
 
    let seed = metadataObject.attributes.filter(attribute => attribute.trait_type == "seed")[0].value;
    let planetCount = metadataObject.attributes.filter(attribute => attribute.trait_type == "planets")[0].value;
    let starDensity = metadataObject.attributes.filter(attribute => attribute.trait_type == "stars")[0].value;
    let mountainRoughness = metadataObject.attributes.filter(attribute => attribute.trait_type == "mountains")[0].value;
    let waterChoppiness = metadataObject.attributes.filter(attribute => attribute.trait_type == "water")[0].value;
    let cloudType = metadataObject.attributes.filter(attribute => attribute.trait_type == "clouds")[0].value;

    console.log("Returning.");
    return { svg, svgDataUri, seed, planetCount, starDensity, mountainRoughness, waterChoppiness, cloudType };

}