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
              <CosmicSpan/> invites you into alternate dimensions composed of colorful alien planes and elevated psychedelic landscapes. Each cosmic world features up to 5 planets (or none at all!), with starscapes of various densities, mountains of that appear rugged or soft, and clouds of various types. Shimmering chemical pools lie at the mountains' base, inviting you for an interstellar skinnydip (though it would no doubt be your last!)
            </p>
            <h2>Artwork generation</h2>
            <p>
              <CosmicSpan/> uses the W3C SVG standard to create infinitely scalable vector graphics and makes liberal use of SVG filters to create
              the rich textures for the various elements of each artwork. The SVG for each worlds is only arond 6kb!
              In order to generate the world, a random seed is passed by the user's web browser to the Cosmic Worlds smart contract at mint time, from which all other numbers are derived in order to create a randomised world. No seed can be used more than once.
            </p>
            <h2>100% on-chain</h2>
            <p>
              <CosmicSpan/> is 100% on-chain NFT art rendered from the blockchain by Solidity code. The metadata is on-chain too! No backend, no IPFS, no Arweave, no cross-platform risk-- everything you need to create a Cosmic World is on the Ethereum blockchain.
              Each Cosmic World artwork is an SVG image that is displayable in any modern web browser or imaging software.
              When an artwork is requested from the contract, the seed is used to generate the SVG code on the fly for the world that is returned by the contract.
            </p>
            <h2>
                Smart contract
            </h2>

            <p>
              The verified <CosmicSpan/> smart contract operates on the Ethereum blockchain can be viewed on <a href={ contractAddress } target="_blank" rel="noreferrer"> 
              <img className="etherscan" alt="etherscan logo" src="/images/etherscan-logo.svg" />
              </a>                     
            </p>
            <p>
              It is a customised version of <a href="https://www.erc721a.org/" target="_blank" rel="noreferrer">Azuki's ERC-721A</a> which offers extremely high gas efficency, especially on multiple mints,
              enabling the ability to batch mint 10 NFTs for the cost of around 3 individual mints.
            </p>

            <h3>
                Intellectual Property and Copyright
            </h3>
            <p>The holder Ethereum address of the NFT for a given artwork is its legal owner and holds its copyright. The token owner is entitled to commercial and property rights for that NFT. Selling the NFT to someone else such that they become recorded as its owner on the blockchain confers these rights for that artwork, including copyright and commercial rights, to the new owner. 
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
