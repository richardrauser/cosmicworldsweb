import CosmicNavBar from "./CosmicNavBar";
import { ToastContainer } from 'react-toastify'
import Header from '@components/Header';
import Footer from '@components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import Head from 'next/head';

export default function Layout(props) {
    const { children } = props;

    return (
        <div className="layout">
            <Head>
                <title>Cosmic Worlds</title>
                <meta name="twitter:card" content="Cosmic Worlds - alien landscapes on the Ethereum blockchain!" />
                <meta name="twitter:site" content="@volstrate"/>
                <meta name="twitter:title" content="Cosmic Worlds - alien landscapes on the Ethereum blockchain!" />
                <meta name="twitter:description" content="On-chain, generative cosmic worlds on the Ethereum blockchain." />
                <meta name="twitter:creator" content="@volstrate"/>
                <meta name="twitter:image" content="http://cosmicworlds.xyz/images/cosmicWorld.png" />
                <meta property="og:title" content="Cosmic Worlds - alien landscapes on the Ethereum blockchain!" />
                <meta property="og:url" content="http://cosmicworlds.xyz/" />
                <meta property="og:image" content="http://cosmicworlds.xyz/images/cosmicWorld.png" />
                <meta property="og:description" content="Description Here" />
            </Head>
            <CosmicNavBar/>
            <ToastContainer />

            <main>
                {React.cloneElement(children)}
            </main>
            <Footer />
        </div>
    );
}