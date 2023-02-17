import { showErrorMessage } from './UIUtils';
import * as Errors from './ErrorMessages';
import { AlienWorldzCurrentNetworkName } from './Constants';
import { switchToCurrentNetwork } from './BlockchainAPI';

export function handleError(err) {
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
    } else if (err.message === Errors.DS_NO_ETH_WALLET) {
      showErrorMessage("No crypto wallet detected. Please install MetaMask. Read the 'How to' guide for more info.");
    } else if (err.message === Errors.DS_NO_ETH_ACCOUNT) {
      showErrorMessage("You need to connect an account via your crypto wallet before you can do that. Read the 'How to' guide for more info.");      
    } else if (err.message === Errors.DS_WRONG_ETH_NETWORK) {

      const errorMessage = "You're on the wrong network. Tap to switch to " + AlienWorldzCurrentNetworkName + ", or read the 'How to' guide for more info.";
      const onClose = switchToCurrentNetwork;
      
      showErrorMessage(errorMessage, onClose);

    } else if (err.code != null) {
      showErrorMessage('An error occurred: (' + err.code + ') ' + err.message);
    } else {
      showErrorMessage('An error occurred.');
    }
  }
  
  