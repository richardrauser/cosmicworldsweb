import { showErrorMessage } from './UIUtils';
import * as Errors from './ErrorMessages';
import { CosmicWorldsCurrentNetworkName } from './Constants';
import { switchToCurrentNetwork } from './BlockchainAPI';

export function handleError(err) {
    // Callers sometimes pass a plain string rather than an Error - an API
    // response's error field, say - so normalise before inspecting it.
    if (typeof err === 'string') {
      err = new Error(err);
    }
    if (err == null) {
      showErrorMessage('An error occurred.');
      return;
    }

    console.log('Handling error ' + err.code + ': ' + err.message);
  
    if (err.code === 4001) {
      showErrorMessage('You rejected the transaction. :-(');
    } else if (err.code === -32002) {
      // -32002: already requesting accounts
      showErrorMessage('Already requesting accounts. Please open MetaMask to confirm.');
    } else if (err.code === -32603) {
      // Internal JSON RPC error
      if (err.data != null && err.data.message != null) {
        showErrorMessage('Oops, an error ocurred. ' + err.data.message);
      } else {
        showErrorMessage('Oops, an Internal JSON RPC error occurred. ');
      }
    }else if (err.code === "ACTION_REJECTED") {
      showErrorMessage("You rejected the transaction.");
    } else if (err.code === 4200) {
      // 4200: the wallet doesn't support the requested method
      showErrorMessage("Your wallet doesn't support this. Please try another Ethereum wallet, such as MetaMask.");
    } else if (err.message === Errors.DS_NO_ETH_WALLET) {
      showErrorMessage("No crypto wallet detected. Please install MetaMask.");
    } else if (err.message === Errors.DS_INCOMPATIBLE_ETH_WALLET) {
      showErrorMessage("None of your browser wallets can connect to Ethereum. If you have more than one wallet extension installed, try disabling the others, or install MetaMask.");
    } else if (err.code === "UNSUPPORTED_OPERATION" && err.message.startsWith("unknown account")) {
      showErrorMessage("You need to connect an Ethereum wallet like MetaMask.");
    } else if (err.message === Errors.DS_NO_RPC_API_KEY) {
      showErrorMessage("The site isn't configured to read from the blockchain (no RPC API key).");
    } else if (err.message === Errors.DS_NO_ETH_ACCOUNT) {
      showErrorMessage("You need to connect an account via your crypto wallet before you can do that.");      
    } else if (err.message === Errors.DS_WRONG_ETH_NETWORK) {
      const errorMessage = "You're on the wrong network. Click here to switch to " + CosmicWorldsCurrentNetworkName + ".";
      const onClick = () => {
        switchToCurrentNetwork().catch((switchError) => {
          console.log('Failed to switch network: ' + switchError.message);
          handleError(switchError);
        });
      };
      showErrorMessage(errorMessage, onClick);
    } else if (err.code != null) {
      showErrorMessage('An error occurred: (' + err.code + ') ' + err.message);
    } else if (err.message) {
      showErrorMessage('An error occurred. ' + err.message);
    } else {
      showErrorMessage('An error occurred.');
    }
  }
  
  