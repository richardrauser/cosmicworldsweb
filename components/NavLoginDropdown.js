import React from 'react';

import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import { Wallet2 } from 'react-bootstrap-icons';

import { fetchAccountDetails, fetchCachedAccountDetails, clearCachedAccountDetails } from '../utils/BlockchainAPI';
import '../utils/UIUtils';
import { handleError } from '../utils/ErrorHandler';
import * as Errors from '../utils/ErrorMessages';
import { CosmicWorldsCurrentNetworkExplorerUrl } from '../utils/Constants';
import ethereum from '../images/ethereum.svg';
import styles from '@styles/NavLoginDropdown.module.css';

class NavLoginDropdown extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false,
      isWalletConnected: false
    };        

    this.connectWallet = this.connectWallet.bind(this);
    this.disconnectWallet = this.disconnectWallet.bind(this);
    this.refreshWallet = this.refreshWallet.bind(this);
    this.fetchAccountDetails = this.fetchAccountDetails.bind(this);
  }
  
    componentDidMount() {
      if (typeof window.ethereum === 'undefined') {
        this.setState({
          isLoading: false,
          isWalletConnected: false,
          isWalletInstalled: (window.ethereum === undefined) ? false : true
        });
        return;
      }

      window.ethereum.on('accountsChanged', (accounts) => {
        clearCachedAccountDetails();
        this.fetchAccountDetails();
      });
      
      window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
        this.disconnectWallet();
      });


      const cachedDetails = fetchCachedAccountDetails();

      if (cachedDetails !== undefined && cachedDetails !== null) {
        console.log("Got address (" + cachedDetails.address + ") and balance (" + cachedDetails.displayBalance + ").");
        this.updateAccountDetails(cachedDetails);
      } else {
        this.setState({
          isLoading: false,
          isWalletConnected: false
        });        
      }
    }

    // componentWillUnmount() {
    //   // window.ethereum.removeListener('accountsChanged', func);
    //   // window.ethereum.removeListener('chainChanged', func);
    // }

    
    async connectWallet() {
      // console.log("Attempting to connect wallet..");
      // const metaMaskUnlocked = (await window.ethereum._metamask.isUnlocked());
      // console.log("Metamask unlocked? " + metaMaskUnlocked);

      // if (window.ethereum.isMetaMask && !metaMaskUnlocked) {
      //   console.log("Metamask lockiepooed.");
      //   showErrorMessage("Please unlock MetaMask.");
      // } else {
        // try {
          this.fetchAccountDetails();
        // } catch (err) {
        //   console.log("ERROR: " + err.message);

        //   handleError(err);
        // }
      // }
    }

    disconnectWallet() {
      console.log("Disconnecting wallet..");

      clearCachedAccountDetails();

      this.setState({
        isLoading: false,
        isWalletConnected: false,
        accountEthAddress: "",
        accountEthBalance: "",
        etherscanUrl: ""  
      });
    }

    refreshWallet() {
      this.fetchAccountDetails();
    }

    async fetchAccountDetails() {

      this.setState({
        isLoading: true,
        isWalletInstalled: true,
        isWalletConnected: false,
        accountEthAddress: "",
        accountEthBalance: "",
        etherscanUrl: ""  
      });

      try {
        const accountDetails = await fetchAccountDetails();

        this.updateAccountDetails(accountDetails);
      
      } catch (err) {
        console.log("Error occurred fetching account details.");

        handleError(err);

        this.setState({
          isLoading: false,
          isWalletInstalled: (err.message === Errors.DS_NO_ETH_WALLET) ? false : true,
          isWalletConnected: false
        });
      };
    }

    updateAccountDetails(accountDetails) {
      this.setState({
        isLoading: false,
        isWalletConnected: true,
        accountEthAddress: accountDetails.shortenedAddress,
        accountEthBalance: accountDetails.displayBalance.toString(),
        etherscanUrl: CosmicWorldsCurrentNetworkExplorerUrl.CurrentNetworkExplorerUrl + "address/" + accountDetails.fullAddress,
      });

      console.log('Address: ', accountDetails.address);
      console.log('Balance: ', accountDetails.displayBalance);
    }
  
    render() {
      if (this.state.isLoading) {
        return (
          <Spinner animation="grow" variant="dark" />
          );
      } else if (this.state.isWalletInstalled !== undefined && !this.state.isWalletInstalled) {
        return (
            <Button target="_blank" href="https://metamask.io">Install MetaMask</Button>
        );
      } else if (!this.state.isWalletConnected) {
        return (
        <Button onClick={ this.connectWallet }>Connect wallet</Button>
        );
      } else {
        return (
          <NavDropdown title="Your Details" id="basic-nav-dropdown">
            <NavDropdown.Item href={this.state.etherscanUrl} target="_blank" className={styles.item}>
            <div className={styles.navDropdownIcon}>
              <Wallet2 /> { this.state.accountEthAddress }              
            </div>
            </NavDropdown.Item>
            <NavDropdown.Item href={this.state.etherscanUrl} target="_blank" className={styles.item}>
              <div className={styles.navDropdownIcon}>
                <Image src={ethereum} alt="ethereum logo" /> { this.state.accountEthBalance }
              </div>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={this.refreshWallet}>Refresh</NavDropdown.Item>
            <NavDropdown.Item onClick={this.disconnectWallet}>Disconnect</NavDropdown.Item>
          </NavDropdown>
        );
      }
    }
  
  }

  export default NavLoginDropdown;