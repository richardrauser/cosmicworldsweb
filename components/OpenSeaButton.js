
import { CosmicWorldsContractAddress } from '../utils/Constants';
import opensea from '../images/opensea.svg';
import { Button } from 'react-bootstrap';
import Image from 'next/image';

export default function OpenSeaButton(props) {

    const openSeaLink = "https://opensea.io/assets/ethereum/" + CosmicWorldsContractAddress + "/" + props.tokenid;

    return(
        <Button className="cardButton keyAction" href={openSeaLink}  target ="_blank" rel="noreferrer">
            <div className="buttonIcon">
                <Image className="buttonLogo" alt="OpenSea logo" src={opensea}/>
            </div>
            <span className="keyActionLabel">View on OpenSea</span>
        </Button>
    );
}