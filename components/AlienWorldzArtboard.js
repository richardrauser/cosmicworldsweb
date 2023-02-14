
import Button from 'react-bootstrap/Button';
import React, {useState} from "react";
import buildAlienWorld from '../scripts/worldBuilder.js';

// function update() {
//     console.log("Updating art board..");
//     const svg = buildAlienWorld();
//     // updateArtBoard();
// }

export default function AlienWorldzArtboard() {
    // const svgDataUri = buildAlienWorld();
    
    const randomSeed = 3;

    const [value, setValue] = useState(buildAlienWorld(randomSeed));

    return(
        // <div id='artboard' onClick={() => setValue(buildAlienWorld())}>
        <div id='artboard'>
            <img id="artboardImage" src={value}></img>	
            <Button variant="primary" onClick={() => setValue(buildAlienWorld(randomSeed))}>Generate</Button>
            <Button variant="primary" onClick={() => setValue(buildAlienWorld(randomSeed))}>Mint</Button>

        </div>	
        
    );
}