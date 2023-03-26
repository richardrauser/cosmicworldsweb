import Head from 'next/head'
import AlienWorldzArtboard from '@components/AlienWorldzArtboard'
import styles from '@styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Alien Worldz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <p className="description">
           On-chain, generative NFT art offering glimpses into alien worlds.
        </p>

        <AlienWorldzArtboard/>

    </div>
  )
}
