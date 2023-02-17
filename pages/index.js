import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import AlienWorldzArtboard from '@components/AlienWorldzArtboard'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.css';

export default function Home() {
  return (
    <div className="container">
      <ToastContainer />
      <Head>
        <title>Alien Worldz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Alien Worldz" />

        <p className="description">
           On-chain, generative NFT art offering glimpses into alien worlds.
        </p>
        <AlienWorldzArtboard/>
      </main>

      <Footer />
    </div>
  )
}
