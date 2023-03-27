
import { ethers } from 'ethers';
import CosmicWorlds from '../contract/CosmicWorlds.json';
import * as Errors from './ErrorMessages';
import CosmicWorldsContractAddress, { CosmicWorldsCurrentNetworkID, CosmicWorldsCurrentNetworkName, CosmicWorldsCurrentNetworkCurrencySymbol, CosmicWorldsCurrentNetworkRpcUrl, CosmicWorldsCurrentNetworkExplorerUrl } from './Constants';
import { showInfoMessage } from './UIUtils';
import{ handleError } from './ErrorHandler';
import detectEthereumProvider from '@metamask/detect-provider'
import { formatEther } from 'ethers';

// import Web3Modal from "web3modal";

const AccountDetailsKey = "DS_ACCOUNT_DETAILS_KEY";

async function getProvider() {
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
  const provider = await getProvider();
    
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
  console.log("Fetching account details..");
    
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
  

export async function isCurrentAccountOwner() {
  console.log("Checking current account owner status..");

  const connected = await isAccountConnected();
  if (!connected) {
    console.log("NOT CONNECTED.");
    return false;
  }

  const account = await fetchAccount();

  const ethAddress = account.toString().toLowerCase();
  const contract = await getReadOnlyContract();
  const ownerAddress = (await contract.owner()).toString().toLowerCase();
  console.log("connected account address: " + ethAddress);
  console.log("owner address: " + ownerAddress);

  return (ethAddress === ownerAddress);
} 

export async function mintCosmicWorld(randomSeed) {
    console.log("Minting Alien World with seed: " + randomSeed);
  
    const contract = await getReadWriteContract(); 
    
    const overrides = {
      gasLimit: 180000
    };
    
    console.log("!!!!!");

    const transaction = await contract.mint(randomSeed, overrides);
    console.log("Tx hash: " + transaction.hash);
} 