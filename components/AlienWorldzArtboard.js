
import Button from 'react-bootstrap/Button';
import React, {useState} from "react";
import buildAlienWorld from '../scripts/worldBuilder.js';

function update() {
    console.log("Updating art board..");
    const svg = buildAlienWorld();
    // updateArtBoard();
}

export default function AlienWorldzArtboard() {
    // const svgDataUri = buildAlienWorld();

    const [value, setValue] = useState(buildAlienWorld());

    return(
        <div id='artboard' onClick={() => setValue(buildAlienWorld())}>
            <img id="artboardImage" src={value}></img>	
            {/* <Button variant="primary" onClick={() => setValue(buildAlienWorld())}>Generate</Button> */}

        </div>	
        
    );
}