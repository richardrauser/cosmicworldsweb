import CosmicNavBar from "./CosmicNavBar";
import { ToastContainer } from 'react-toastify'
import Header from '@components/Header';
import Footer from '@components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect } from "react";
import Head from 'next/head';
var mobile = require('is-mobile');
import { Alert } from "react-bootstrap";
import { useState } from "react";

export default function Layout(props) {
    const { children } = props;

    const [metaMaskAlert, setMetaMaskAlert] = useState(false);

    useEffect(() => {
        const noWallet = window.ethereum == null;
        const showAlert = mobile() && noWallet; 
        setMetaMaskAlert(showAlert);
    }, []);

    return (
        <div className="layout">
            <Head>
                <title>Cosmic Worlds</title>
                <meta name="twitter:card" content="Cosmic Worlds - alien landscapes on the Ethereum blockchain!" />
                <meta name="twitter:site" content="@volstrate"/>
                <meta name="twitter:title" content="Cosmic Worlds - alien landscapes on the Ethereum blockchain!" />
                <meta name="twitter:description" content="On-chain, generative cosmic worlds on the Ethereum blockchain." />
                <meta name="twitter:creator" content="@volstrate"/>
                <meta name="twitter:image" content="https://cosmicworlds.xyz/images/cosmicWorld.png" />
                <meta property="og:title" content="Cosmic Worlds - alien landscapes on the Ethereum blockchain!" />
                <meta property="og:url" content="https://cosmicworlds.xyz/" />
                <meta property="og:image" content="https://cosmicworlds.xyz/images/cosmicWorld.png" />
                <meta property="og:description" content="Description Here" />
            </Head>
            <CosmicNavBar/>
            <ToastContainer />

            <main> 
                { metaMaskAlert &&
                    <a href="https://metamask.app.link/dapp/cosmicworlds.xyz" target="_blank" rel="noopener noreferrer">
                        <Alert>
                            <img className="metamask" alt="MetaMask logo" src="/images/MetaMaskFox.svg" />

                            Open in MetaMask
                        </Alert>                    
                    </a>
                }
                {React.cloneElement(children)}
            </main>
            <Footer />
        </div>
    );
}