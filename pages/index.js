import Head from 'next/head'
import CosmicArtboard from '@components/CosmicArtboard'
import styles from '@styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cosmic Worlds</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <p className="description">
           On-chain, generative NFT art offering glimpses into alternate cosmic worlds.
        </p>

        <CosmicArtboard/>

    </div>
  )
}
