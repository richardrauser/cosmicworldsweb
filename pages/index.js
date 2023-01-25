import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import AlienWorldzArtboard from '@components/AlienWorldzArtboard'

export default function Home() {
  return (
    <div className="container">
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
