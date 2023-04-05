import CosmicNavBar from "./CosmicNavBar";
import { ToastContainer } from 'react-toastify'
import Header from '@components/Header';
import Footer from '@components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

export default function Layout(props) {
    const { children } = props;

    return (
        <div className="layout">
            <CosmicNavBar/>
            <ToastContainer />

            <main>
                {React.cloneElement(children)}
            </main>
            <Footer />
        </div>
    );
}