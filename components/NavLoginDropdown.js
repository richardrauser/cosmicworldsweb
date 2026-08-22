import React, { useEffect } from "react";

import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Image from "next/image";
import { Wallet2 } from "react-bootstrap-icons";

import {
  fetchAccountDetails,
  fetchCachedAccountDetails,
  clearCachedAccountDetails,
  hasAccount,
} from "../utils/BlockchainAPI";
import "../utils/UIUtils";
import { handleError } from "../utils/ErrorHandler";
import * as Errors from "../utils/ErrorMessages";
import {
  addWalletListener,
  hasInjectedWallet,
  listWallets,
  selectWallet,
  clearPreferredWallet,
} from "../utils/WalletProvider";
import { CosmicWorldsCurrentNetworkExplorerUrl } from "../utils/Constants";
import ethereum from "../images/ethereum.svg";
import styles from "@styles/NavLoginDropdown.module.css";

export default function NavLoginDropdown(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  const [isWalletInstalled, setIsWalletInstalled] = React.useState(false);
  const [accountEthAddress, setAccountEthAddress] = React.useState("");
  const [accountEthBalance, setAccountEthBalance] = React.useState("");
  const [etherscanUrl, setEtherscanUrl] = React.useState("");
  const [availableWallets, setAvailableWallets] = React.useState([]);

  const connectWallet = async (walletKey) => {
    console.log("Attempting to connect wallet.. " + (walletKey || "(auto)"));
    // const metaMaskUnlocked = (await window.ethereum._metamask.isUnlocked());
    // console.log("Metamask unlocked? " + metaMaskUnlocked);

    // if (window.ethereum.isMetaMask && !metaMaskUnlocked) {
    //   console.log("Metamask lockiepooed.");
    //   showErrorMessage("Please unlock MetaMask.");
    // } else {
    try {
      if (walletKey != null) {
        await selectWallet(walletKey);
      }
      const accountDetails = await fetchAccountDetails();
      updateAccountDetails(accountDetails, true);
    } catch (err) {
      console.log("ERROR: " + err.message);
      handleError(err);
    }
    // }
  };

  const fetchDetails = async () => {
    setIsLoading(true);
    setAccountEthAddress("");
    setAccountEthBalance("");
    setEtherscanUrl("");

    const wallets = await listWallets();
    setAvailableWallets(wallets);
    console.log(
      "Wallets available: " +
        wallets
          .map((w) => w.name + " (chain " + w.chainId + ")")
          .join(", ")
    );
    const hasWallet = wallets.length > 0;

    try {
      const connected = await hasAccount();

      if (!connected) {
        console.log("Not connected..");
        updateAccountDetails(null, hasWallet);
        return;
      }

      const cachedDetails = fetchCachedAccountDetails();
      if (cachedDetails !== undefined && cachedDetails !== null) {
        console.log(
          "Got address (" +
            cachedDetails.fullAddress +
            ") and balance (" +
            cachedDetails.displayBalance +
            ")."
        );
        updateAccountDetails(cachedDetails, hasWallet);
        return;
      }

      const accountDetails = await fetchAccountDetails();
      updateAccountDetails(accountDetails, hasWallet);
    } catch (error) {
      console.log("Error occurred fetching account details. " + error);
      setIsLoading(false);
      // only display error if wallet is connected
      if (isWalletConnected == true) {
        handleError(error);
      }
      updateAccountDetails(null, hasWallet);
    }
  };

  const disconnectWallet = () => {
    console.log("Disconnecting wallet..");
    clearCachedAccountDetails();
    updateAccountDetails(null, isWalletInstalled);
  };

  const refreshWallet = () => {
    fetchDetails();
  };

  const switchWallet = () => {
    console.log("Forgetting wallet choice..");
    clearCachedAccountDetails();
    clearPreferredWallet();
    updateAccountDetails(null, isWalletInstalled);
  };

  const updateAccountDetails = (accountDetails, hasWallet) => {
    console.log("Updating account details..");
    setIsLoading(false);
    if (accountDetails != null && hasWallet) {
      console.log("Has details and wallet.");
      setIsWalletInstalled(true);
      setIsWalletConnected(true);
      setAccountEthAddress(accountDetails.shortenedAddress);
      setAccountEthBalance(accountDetails.displayBalance.toString());
      setEtherscanUrl(
        CosmicWorldsCurrentNetworkExplorerUrl +
          "address/" +
          accountDetails.fullAddress
      );

      console.log("Address: ", accountDetails.fullAddress);
      console.log("Balance: ", accountDetails.displayBalance);
    } else {
      console.log("No details or wallet.");
      setIsWalletInstalled(hasWallet);
      setIsWalletConnected(false);
      setAccountEthAddress("");
      setAccountEthBalance("");
      setEtherscanUrl("");
    }
  };

  useEffect(() => {
    const removeListeners = [];

    async function listenForWalletChanges() {
      const removeAccountsListener = await addWalletListener(
        "accountsChanged",
        (accounts) => {
          console.log("Accounts changed.");
          clearCachedAccountDetails();
          disconnectWallet();
          // Is this causing multiple reloads?!
          fetchDetails();
        }
      );

      // Is this causing multiple reloads?!
      const removeChainListener = await addWalletListener(
        "chainChanged",
        (chainId) => {
          console.log("Chain changed.");
          // Handle the new chain.
          // Correctly handling chain changes can be complicated.
          // We recommend reloading the page unless you have good reason not to.
          clearCachedAccountDetails();
          disconnectWallet();

          // Is this causing multiple reloads?!
          // window.location.reload();
        }
      );

      removeListeners.push(removeAccountsListener, removeChainListener);
    }

    async function fetchData() {
      await listenForWalletChanges();
      await fetchDetails();
    }
    fetchData();

    return () => {
      for (const removeListener of removeListeners) {
        if (removeListener != null) {
          removeListener();
        }
      }
    };
  }, []);

  // if (typeof window.ethereum === 'undefined') {
  //     setIsLoading(false);
  //     setIsWalletInstalled(false);
  // }

  // Wallets that can't answer eth_chainId can't be connected to, so don't
  // offer them.
  const connectableWallets = availableWallets.filter(
    (wallet) => wallet.isUsable
  );

  return (
    <div>
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          {/* <Spinner variant='dark' /> */}
        </div>
      ) : (
        <div>
          {!isWalletInstalled ? (
            <Button target="_blank" href="https://metamask.io">
              Install MetaMask
            </Button>
          ) : (
            <div>
              {!isWalletConnected ? (
                connectableWallets.length > 1 ? (
                  <Dropdown align="end">
                    {/* Toggle keeps the plain Connect wallet button styling. */}
                    <Dropdown.Toggle id="wallet-picker-dropdown">
                      Connect wallet
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {connectableWallets.map((wallet) => (
                        <Dropdown.Item
                          key={wallet.key}
                          onClick={() => connectWallet(wallet.key)}
                          className={styles.item}
                        >
                          <div className={styles.navDropdownIcon}>
                            {wallet.icon ? (
                              <img
                                src={wallet.icon}
                                alt={wallet.name + " logo"}
                                width="20"
                                height="20"
                              />
                            ) : (
                              <Wallet2 />
                            )}{" "}
                            {wallet.name}
                            {!wallet.isOnRequiredChain && " (wrong network)"}
                          </div>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Button onClick={() => connectWallet()}>Connect wallet</Button>
                )
              ) : (
                <NavDropdown title="Your Details" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    href={etherscanUrl}
                    target="_blank"
                    className={styles.item}
                  >
                    <div className={styles.navDropdownIcon}>
                      <Wallet2 /> {accountEthAddress}
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href={etherscanUrl}
                    target="_blank"
                    className={styles.item}
                  >
                    <div className={styles.navDropdownIcon}>
                      <Image src={ethereum} alt="ethereum logo" />{" "}
                      {accountEthBalance}
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={refreshWallet}>
                    Refresh
                  </NavDropdown.Item>
                  {connectableWallets.length > 1 && (
                    <NavDropdown.Item onClick={switchWallet}>
                      Use a different wallet
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item onClick={disconnectWallet}>
                    Disconnect
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
