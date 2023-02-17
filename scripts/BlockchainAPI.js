
import { ethers } from 'ethers';
import AlienWorldz from '../artifacts/contracts/AlienWorldz.sol/AlienWorldz.json';
import * as Errors from './ErrorMessages';
import AlienWorldzContractAddress, { AlienWorldzCurrentNetworkID, AlienWorldzCurrentNetworkName, AlienWorldzCurrentNetworkCurrencySymbol, AlienWorldzCurrentNetworkRpcUrl, AlienWorldzCurrentNetworkExplorerUrl } from './Constants';
import { showInfoMessage } from './UIUtils';
import{ handleError } from './ErrorHandler';
import detectEthereumProvider from '@metamask/detect-provider'


// import Web3Modal from "web3modal";

const AccountDetailsKey = "DS_ACCOUNT_DETAILS_KEY";

async function getProvider() {
  // const provider = ethers.getDefaultProvider('ropsten');
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  const provider = await detectEthereumProvider();
  
  if (provider) {

    console.log('Ethereum successfully detected!')

    // From now on, this should always be true:
    // provider === window.ethereum

    // Access the decentralized web!

    // Legacy providers may only have ethereum.sendAsync
    // const chainId = await provider.request({
    //   method: 'eth_chainId'
    // });
  } else {

    // if the provider is not detected, detectEthereumProvider resolves to null
    console.error('Please install MetaMask!');
    console.log('Could not get wallet. Throwing error NO_ETH_WALLET');
    throw Error(Errors.DS_NO_ETH_WALLET);
  }
  // const provider = new 

  return new ethers.BrowserProvider(window.ethereum);
  
  // const provider = new ethers.providers.getDefaultProvider();
  
  // const providerOptions = {};
  // const web3Modal = new Web3Modal({
  //   network: "mainnet",
  //   cacheProvider: true,
  //   providerOptions
  // });

  

  // const provider = await web3Modal.connect();

  // const ethersProvider = new ethers.providers.Web3Provider(provider);

  // return ethersProvider;
  // return provider;
}

// function checkWallet() {
//   if (typeof window.ethereum === 'undefined') {
    // console.log('Could not get wallet. Throwing error NO_ETH_WALLET');
//     throw Error(Errors.DS_NO_ETH_WALLET);
//   } else {
//     console.log('Has wallet.');
//   }
// }

export async function isOnCorrectNetwork() {

  const provider = await getProvider();
  const network = await provider.getNetwork();
  console.log("Network: " + network.chainId);
  if (network.chainId === AlienWorldzCurrentNetworkID) {
    return true;
  } else {
    return false;
  }
}

export async function switchToCurrentNetwork() {
 // will attempt to add current network, behaviour is to switch if already present in MetaMask
  console.log("Switching to " + AlienWorldzCurrentNetworkName + "...");
  // checkWallet();

  const correctNetwork = await isOnCorrectNetwork();
  if (correctNetwork) {
    showInfoMessage("You're already on the " + AlienWorldzCurrentNetworkName + " network. Yay.");
    return;
  }

  const data = [{
    chainId: "0x" + AlienWorldzCurrentNetworkID.toString(16),
    chainName: AlienWorldzCurrentNetworkName,
    nativeCurrency:
        {
            name: AlienWorldzCurrentNetworkCurrencySymbol,
            symbol: AlienWorldzCurrentNetworkCurrencySymbol,
            decimals: 18
        },
    rpcUrls: [AlienWorldzCurrentNetworkRpcUrl],
    blockExplorerUrls: [AlienWorldzCurrentNetworkExplorerUrl],
  }];

  const tx = await window.ethereum.request({method: 'wallet_addEthereumChain', params:data});
  if (tx) {
      console.log(tx)
  }
}
export async function getContract() {
  // checkWallet();
  const provider = await getProvider();

  const { chainId } = await provider.getNetwork();
  console.log("CHAIN ID: " + chainId); // 42
  
  if (chainId !== AlienWorldzCurrentNetworkID) {
    console.log("Not on right network");
    throw Error(Errors.DS_WRONG_ETH_NETWORK);
  } else {
    console.log("On right network");    
  }
  const contract = new ethers.Contract(AlienWorldzContractAddress, AlienWorldz.abi, provider);
  return contract;
}

export async function getSigner() {
  // checkWallet();
  const provider = await getProvider();
  const signer = provider.getSigner();
  return signer;
}

export async function getContractWithSigner() {
  // checkWallet();
  const provider = await getProvider();
  const contract = new ethers.Contract(AlienWorldzContractAddress, AlienWorldz.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);  
  return contractWithSigner;
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
  // checkWallet();

  console.log("Fetching account..");
  const provider = await getProvider();
  var [account] = await provider.listAccounts();

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
  const displayBalance = Number(ethers.utils.formatEther(weiBalance)).toFixed(4);

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
  const contract = await getContract();
  const ownerAddress = (await contract.owner()).toString().toLowerCase();
  console.log("connected account address: " + ethAddress);
  console.log("owner address: " + ownerAddress);

  return (ethAddress === ownerAddress);
} 

export async function mintAlienWorld(randomSeed) {
  try {
    const correctNetwork = await isOnCorrectNetwork();
    if (!correctNetwork) {    
      console.log("Not on right network");
      throw Error(Errors.DS_WRONG_ETH_NETWORK);
    }
    const contractWithSigner = await getContractWithSigner(); 

    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const tokenCount = await contractWithSigner.balanceOf(account);
    console.log("User's token count: " + tokenCount);
    if (tokenCount >= AlienWorldzMaxTokensPerUser && account !== "0xBC10a3aE909B1b94f4C3E39607aD19D386dCe32a") {
      showErrorMessage("You already have " + tokenCount + " AlienWorldz artworks. You've reached the mint limit of " + AlienWorldzMaxTokensPerUser + " tokens!");
      return;
    }

    console.log("Minting Alien World with seed: " + randomSeed)

    const overrides = {
      // value: this.state.mintPrice, 
      gasLimit: 120000
    }
    
    const transaction = await contractWithSigner.mintStripes(randomSeed, overrides);
    console.log("Tx hash: " + transaction.hash);
    this.setState({
      doneSuccess: true,
      txHash: transaction.hash,
    });

    toast.success("Successfully minted your AlienWorldz NFT!");
  } catch (err) {
    if (err.code === "UNSUPPORTED_OPERATION" && err.message.startsWith("unknown account")) {
      showErrorMessage("You need to connect an Ethereum wallet like MetaMask.");
    } else {
      handleError(err);
    }
  }

} 