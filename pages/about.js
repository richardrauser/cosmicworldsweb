import CosmicSpan from "@components/CosmicSpan";
import { CosmicWorldsContractAddress, CosmicWorldsCurrentNetworkExplorerUrl } from "utils/Constants";
import styles from '@styles/About.module.css';

export default function About() {

  const contractAddress = CosmicWorldsCurrentNetworkExplorerUrl + "address/" + CosmicWorldsContractAddress;

    return (
        <div className="contentPanel">
            <h1>About</h1>
            <div className={styles.imagesPanel}>
              <ul className={styles.images}>
                  <li><img src="images/samples/cosmicWorld1.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld2.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld3.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld4.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld5.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld6.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld7.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld8.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld9.svg"/></li>
                  <li><img src="/images/samples/cosmicWorld10.svg"/></li>
              </ul>

            </div>
            <p>
              <CosmicSpan/> invites you into an alternate dimension of alien planes, alternate existences and elevated, psychedelic landscapes. Each cosmic world features up to 5 planets (or none at all!), with starscapes of various densities, mountains that appear rugged or soft, and clouds of various types. Shimmering chemical pools lie at the mountains' base.
            </p>
            <p>
              <CosmicSpan/> is 100% on-chain NFT art rendered from the blockchain by Solidity code.
              The result is an SVG image that is displayable in any modern web browser or imaging software.
            </p>
            <h3>
                  Intellectual Property and Copyright
            </h3>
            <p>The holder Ethereum address of the NFT for a given artwork is its legal owner and holds its copyright. The token owner is entitled to commercial and property rights for that NFT. Selling the NFT to someone else such that they become recorded as its owner on the blockchain confers these rights for that artwork, including copyright and commercial rights, to the new owner. 
            </p>

            <h3>
                Smart contract
            </h3>

            <p>
              The verified <CosmicSpan/> smart contract can be viewed on <a href={ contractAddress } target="_blank" rel="noreferrer"> 
              <img className="etherscan" alt="etherscan logo" src="/images/etherscan-logo.svg" />
              </a>                     
            </p>

            <h3>
                Who created this?
            </h3>

            <p>
              <a href="https://twitter.com/volstrate" target="_blank" rel="noreferrer">volstrate</a>, aka <a href="https://twitter.com/richardrauser" target="_blank" rel="noreferrer">Richard Rauser</a>. Feel free to get in touch about <CosmicSpan/>!
            </p>


        </div>
    )
}
