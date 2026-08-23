
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from "react";
import buildCosmicWorld, { getWorldTraits } from '../utils/worldBuilder.js';
import { mintCosmicWorld, mintTenCosmicWorlds } from '../utils/BlockchainAPI.js';
import { handleError } from 'utils/ErrorHandler.js';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { ArrowRepeat } from 'react-bootstrap-icons';
import ethereum from '../images/ethereum-white.png';
import styles from '@styles/CosmicArtboard.module.css';
import Loading from './Loading.js';
import WorldTraits from './WorldTraits.js';
import { Dice5Fill } from 'react-bootstrap-icons';
import { CosmicWorldsTokenLimit } from '../utils/Constants.js';

export default function CosmicArtboard() {
    
    const randomCeiling = 5_000_000;
    const [randomSeed, setRandomSeed] = useState(null);
    const [svg, setSvg] = useState(null);
    const [traits, setTraits] = useState(null);
    const [mintCount, setMintCount] = useState(null);

    const updateSeed = () => {
        const seed = Math.trunc(Math.random() * randomCeiling);
        console.log("Regerating with seed: " + seed);
        const svg = buildCosmicWorld(seed);
        setRandomSeed(seed);
        setSvg(svg);
        setTraits(getWorldTraits(seed));
    };


    useEffect(() => {
        updateSeed();
      }, []);

    useEffect(() => {
        // Read-only and purely informational, so a failure just shows "?" -
        // no toast, and it never holds up the world being previewed.
        const fetchMintCount = async () => {
            try {
                const response = await fetch("/api/supply");
                const body = await response.json();

                if (!response.ok) {
                    throw Error(body.error);
                }

                setMintCount(body.totalSupply);
            } catch (error) {
                console.log("Error fetching total supply: " + error);
                setMintCount("?");
            }
        };

        fetchMintCount();
      }, []);

      const mint = async () => {
        
        console.log("Minting..");
        console.log("Random seed: " + randomSeed);
        try {
            await mintCosmicWorld(randomSeed);
            toast.success("Successfully minted your Cosmic Worlds NFT!");
        } catch (error)  {
            console.log("Error Minting: " + JSON.stringify(error));                        
            handleError(error);
        }       
    };

    const mintTen = async () => {
                try {
            await mintTenCosmicWorlds();
            toast.success("Successfully minted 10 Cosmic Worlds NFTs!");
        } catch (error)  {
            console.log("Error Minting: " + JSON.stringify(error));
            handleError(error);
        }       
    };

    return(
        <div>
        { !randomSeed || !svg || !traits ? (
            <Loading/>
        ) : (
            <div>
            <div className={styles.artboard}>
                <img className={styles.artboardImage} src={svg}></img>
            </div>
            <div className={styles.detailCard}>
                    <div className={styles.traits}>
                        <WorldTraits
                            seed={ traits.seed }
                            planetCount={ traits.planetCount }
                            starDensity={ traits.starDensity }
                            mountainRoughness={ traits.mountainRoughness }
                            waterChoppiness={ traits.waterChoppiness }
                            cloudType={ traits.cloudType }
                        />
                    </div>
                    <div className={styles.actions}>
                        <Button variant="primary" className="keyAction" onClick={updateSeed}>
                            <div className="buttonIcon">
                                <ArrowRepeat />
                            </div>
                            <span className="keyActionLabel">Shuffle</span>
                        </Button>
                        <Button variant="primary" className="keyAction" onClick={mint} randomseed={randomSeed}>
                            <div className="buttonIcon">
                                <Image src={ethereum} alt="ethereum logo" />
                            </div>
                            <span className="keyActionLabel">
                                Mint for free
                                <span className="keyActionNote">only pay gas</span>
                            </span>
                        </Button>
                        <Button variant="primary" className="keyAction" onClick={mintTen} randomseed={randomSeed}>
                            <div className="buttonIcon">
                                <Dice5Fill />
                            </div>
                            <span className="keyActionLabel">
                                Mint 10 randoms
                                <span className="keyActionNote">for gas cost of 3</span>
                            </span>
                        </Button>
                    </div>
            </div>
            <div className={styles.mintCount}>
                Total minted worlds: { mintCount == null ? "Loading.." : String(mintCount) + " / " + CosmicWorldsTokenLimit }
            </div>
            </div>
        )}
    </div>
   );
}
