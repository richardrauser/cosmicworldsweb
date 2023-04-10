import Head from 'next/head'
import styles from '@styles/Home.module.css';
import Image from 'next/image';
// import { cosmicAnimation } from '../images/cosmicWorldsAnimation500px.gif';
export default function Home() {

  // const [adjective, setAdjective] = useState("");

  const adjectives = ["remote", "chromatic", "far-flung", "distant", "floursecent", "hallucinatory", "mind-bending", "titilating"];

  const now = new Date();
  let minutes = now.getMinutes();

  const adjective = adjectives[minutes % adjectives.length];

  return (
    <div className={styles.container}>
      <Head>
        <title>Cosmic Worlds</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="contentPanel">
        <p className={styles.description}>
           On-chain, generative NFT art offering glimpses into { adjective } cosmic worlds.
        </p>
        <div className="animation">
          <img width="500px" height="500px" src="/images/cosmicWorldsAnimation500px.gif" alt="Cosmic Worlds animation" />
        </div>
        
        <p className={styles.description}>
           Coming soon!
        </p>
      </div>

    </div>
  )
}
