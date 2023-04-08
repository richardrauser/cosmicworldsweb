import CosmicSpan from "@components/CosmicSpan";
import { CosmicWorldsContractAddress, CosmicWorldsCurrentNetworkExplorerUrl } from "utils/Constants";
import etherscan from '../images/ethereum-white.png';


export default function About() {

  const contractAddress = CosmicWorldsCurrentNetworkExplorerUrl + "address/" + CosmicWorldsContractAddress;

    return (
        <div className="contentPanel">
            <h1>About</h1>
            <p>
              <CosmicSpan/> invites you into an alternate dimension of alien planes, alternate existence and elevated landscapes. 
            </p>
            <p>
              <CosmicSpan/> is 100% on-chain NFT art rendered from the blockchain by Solidity code.
              The result is an SVG image that is displayable in any modern web browser or imaging software.
            </p>
            <h3>
                  Intellectual Property and Copyright
            </h3>
            <p>Whoever owns the the NFT for a given artwork is its legal owner and holds its copyright. The token owner is entitled to commercial and property rights for that NFT. Selling the NFT to someone else such that they become recorded as its owner on the blockchain confers these rights for that artwork, including copyright and commercial rights, to the new owner. 
            </p>

            <h3>
                Smart contract
            </h3>

            <p>
              The verified <CosmicSpan/> smart contract can be viewed on <a href={ contractAddress } target="_blank" rel="noreferrer"> 
              <img className="etherscan" alt="etherscan logo" src= { etherscan } />
              </a>                     
            </p>

        </div>
    )
}
