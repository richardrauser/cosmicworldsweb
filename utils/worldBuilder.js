import { ethers, keccak256 } from 'ethers';

function generateRandomArtDataUri() {
    const randomSeed = Math.trunc(Math.random() * 5_000_000);
    // const randomSeed = 1234;

    return generateArt(randomSeed);
}

function generateArt(randomSeed) {
    console.log("Generating art: " + randomSeed);

    // const gradient = `<radialGradient id="planetGradient">
    //                     <stop offset="10%" stop-color="gold" />
    //                     <stop offset="95%" stop-color="red" />
    //                   </radialGradient>`;


    var defs = "<defs><clipPath id='master'><rect x='0' y='0' width='1000' height='1000'/></clipPath>"
    // defs += gradient;
    defs += `</defs>`;

// planets += gradient;

    const shapes = getShapes(randomSeed);

    const angle = randomInt(randomSeed, 0, 360);
    const firstColour = randomColour(randomSeed + 3);
    const secondColour = randomColour(randomSeed + 3);
    const thirdColour = randomColour(randomSeed + 3);
    const backgroundColour = `linear-gradient(${angle}deg, ${firstColour} 0%, ${secondColour} 35%, ${thirdColour} 100%)`;

    const svgString = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' style='background-image:" + backgroundColour + "'>" + defs + "<g clip-path='url(#master)'>" + shapes + "</g></svg>";
    console.log(`SVG: ${svgString}`);
    const encodedSvg = encodeURIComponent(svgString);

    return `data:image/svg+xml,${encodedSvg}`;
}

function getShapes(randomSeed) {
    const stars = getStars(randomSeed);
    const planets = getPlanets(randomSeed);
    const mountain = getMountains(randomSeed);
    const clouds = getClouds(randomSeed);
    const water = getWater(randomSeed);

    var shapes = "";
    shapes += stars;
    shapes += " " + planets;
    shapes += " " + mountain;
    shapes += " " + clouds;
    shapes +=  " " + water;

    return shapes;
}

function getStars(randomSeed) {

    const stars = `
        <filter id="stars">
        <feTurbulence baseFrequency="0.2"                          
        seed="` + randomSeed + `"
        />
        <feColorMatrix values="0 0 0 9 -4
                            0 0 0 9 -4
                            0 0 0 9 -4
                            0 0 0 0 1"/>
        </filter>
        <rect width="100%" height="100%" opacity="50%" filter="url(#stars)"/>
        `;

    return stars;
}

function getPlanets(planetSeed, tintColour) {

    const planetCount = randomInt(planetSeed * 2, 0, 5);

    var planets = "";

    for (var i = 0; i < planetCount; i++) {
        
        const randomSeed = planetSeed * 2 + i;

        const radius = randomInt(randomSeed, 20, 200);
        const x = randomInt(randomSeed, 50, 950);
        const y = randomInt(randomSeed, 0, 500);

        const colour = randomColour(randomSeed + 10 + i, tintColour);

        const stop1 = randomInt(randomSeed, 3, 25);
        const colour1 = randomColour(randomSeed + i, tintColour);
        const stop2 = randomInt(randomSeed, 75, 97);
        const colour2 = randomColour(randomSeed + i + 10, tintColour);
        // const colour2 = "grey";
        
        const fx = 50;// randomInt(randomSeed, 1, 4) * 25;
        const fy = 50;// randomInt(randomSeed, 1, 4) * 25;

        const gradient = `<defs><radialGradient id="planetGradient` + i + `" fx="` + fx + `%" fy="` + fy + `%">
                            <stop offset="${stop1}%" stop-color="` + colour1 + `" />
                            <stop offset="${stop2}%" stop-color="` + colour2 + `" />
                          </radialGradient></defs>`;

        // const filter = `<filter id='planetFilter'>
        //     <feTurbulence type="fractalNoise" baseFrequency='0.4' result='noise' numOctaves="" />
        //     <feComposite operator="in" in="ripples" in2="SourceGraphic"/>
        // </filter>`;

        // from https://cloudfour.com/thinks/generating-solar-systems-part-2-filters-gradients-and-clip-paths/
          // We'll generate some random values for our turbulence
        const fractal = randomInt(randomSeed, 0, 10) > 5;
        const turbulenceType = fractal ? 'fractalNoise' : 'turbulence';
        // We intentionally make the y value larger than the x value
        // to create horizontal striping patterns
        const baseFrequencyX = randomInt(randomSeed, 1, 4) / (radius * 2);
        const baseFrequencyY = randomInt(randomSeed, 2, 4) / radius;
        const numOctaves = randomInt(randomSeed, 3, 10);
        const seed = Math.random();

        // And some random values for our lighting
        const elevation = randomInt(randomSeed, 30, 100);
        const surfaceScale = randomInt(randomSeed, 5, 10);

        const filter = `<filter id="planetFilter${i}"> 
        <feTurbulence
          type="${turbulenceType}"
          baseFrequency="${baseFrequencyX} ${baseFrequencyY}"
          seed="${seed}"
          numOctaves="${numOctaves}"
        />
        <feDiffuseLighting lighting-color="${colour1}" surfaceScale="${surfaceScale}">
          <feDistantLight elevation="${elevation}" />
        </feDiffuseLighting>
        <feComposite operator="in" in2="SourceGraphic"/>
      </filter>`;
          
        planets += gradient;
        planets += filter;
        planets += `<circle cx="` + x + `" 
                            cy="` + y + `" 
                            r="` + radius + `" 
                            filter="url('#planetFilter` + i + `')"
                            />`;
        planets += `<circle cx="` + x + `" 
                            cy="` + y + `" 
                            r="` + radius + `" 
                            fill="url('#planetGradient` + i + `')"
                            opacity="0.5"
                            />`;
        
    }

    return planets;
}

function getMountains(randomSeed, tintColour) {

    var polygonPoints = buildLine(randomSeed, 1000, 51);

    polygonPoints = polygonPoints.join(" ");
    polygonPoints += " 1000,1000 -1,1000";

    console.log("POINTS: \n " + polygonPoints);

    const mountainColour = randomColour(randomSeed + 3, tintColour);
    const midColourPoint = randomInt(randomSeed, 10, 90);
    const mountainColour2 = randomColour(randomSeed + 5, tintColour);

    const gradient = `<defs><linearGradient id="mountainGradient">
                            <stop offset="5%" stop-color="` + mountainColour + `" />
                            <stop offset="` + midColourPoint + `%" stop-color="` + mountainColour2 + `" />
                            <stop offset="95%" stop-color="` + mountainColour + `" />
                        </linearGradient></defs>`;


    const baseFrequency = randomInt(randomSeed, 1, 3);
    const scale = randomInt(randomSeed, 1, 3);
    const filter = `<filter id='mountainFilter' x='0%' y='0%' width='100%' height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency='0.0${baseFrequency}' result='noise' numOctaves="15" />\
                        <feDiffuseLighting in='noise' lighting-color='white' surfaceScale='${scale}'>
                        <feDistantLight azimuth='45' elevation='10' />
                    </feDiffuseLighting>
                <feComposite operator="in" in="ripples" in2="SourceGraphic"/>
            </filter>`;

    const shadeFrequency = "0.004 0.01";
    const matrixParam = 1;
    const shadingFilter = `<filter id="shadingFilter">
                            <feTurbulence type="fractalNoise" 
                                        baseFrequency="` + shadeFrequency + `" 
                                        numOctaves="2" 
                                        seed="` + randomSeed + `"
                                        />
                            <feColorMatrix values="0 1 0 0 -4
                                                1 1 0 0 -4
                                                1 0 0 0 -4
                                                0 1 1 0 -1"/>
                            <feComposite operator="in" in="ripples" in2="SourceGraphic"/>
                            </filter>
                        `;
    
    var mountain = "";
    mountain += gradient;
    mountain += filter;
    mountain += shadingFilter;

    const opacity = randomInt(randomSeed, 3, 8);    

    mountain += `<polygon points="` + polygonPoints + `"
                        filter="url('#mountainFilter')"
                        />`;
    mountain += `<polygon points="` + polygonPoints + `"
                            fill="url('#mountainGradient')"
                            opacity="0.` + opacity + `"
                            />`;
    mountain += `<polygon points="` + polygonPoints + `"
                        filter="url('#shadingFilter')"
                        opacity="0.5"
                        />`;

    return mountain;
}


function buildLine(randomSeed, width, pointCount) {
    const interval = width / (pointCount - 1);

    console.log("INTERVAL: " + interval);

    var points = [];
    var currentY = 500; // starting currentY is y offset

    for (var i = 0; i <= pointCount; i++) {
        const x = i * interval;

        const pointSeed = (randomSeed + i) + 1000;
        const yChange = randomInt(pointSeed, 0, 20);
        const up = randomInt(pointSeed, 0, 100) >  50;

        if (up) {
            currentY += yChange; 
        } else {
            currentY -= yChange;
        }

        const point = [x, currentY];
        console.log("POINT: " + point);
        points.push(point);
    }
    console.log("POINTS: " + points);
    return points;
}

function getClouds(randomSeed) {

    // const baseFrequencyDenominator = 1000;
    // const baseFrequency1 = randomInt(randomSeed * 2, 1, 50) / baseFrequencyDenominator;
    // const baseFrequency2 = randomInt(randomSeed * 3, 1, 50) / baseFrequencyDenominator;
    // const baseFrequency = baseFrequency1 + " " + baseFrequency2; 
    // const baseFrequency = "0.01 0.5";
    const baseFrequency = "0.002 0.014";
    const opacity = randomInt(randomSeed * 5, 30, 80);
    console.log("Base frequency: " + baseFrequency);

    const clouds = `
        <filter id='clouds'>
            <feTurbulence type='fractalNoise' 
                          baseFrequency='${baseFrequency}' 
                          numOctaves='200' 
                          seed='${randomSeed}'
                          />
        </filter>
        <rect width='100%' height='100%' opacity='${opacity}%' filter='url(#clouds)'/>`;

    return clouds;
}

function getWater(randomSeed) {

    var shorelineCurves = "";
    const segmentWidthMax = 400;
    var xPos = 0;
    var up = true;

    while (xPos < 1000) {
        var segmentWidth = randomInt(randomSeed + xPos, 100, 400);
        
        if (segmentWidth > 1000 - xPos) {
            segmentWidth = 1000 - xPos;
        } else if ((1000 - xPos) - segmentWidth < 100) {
            segmentWidth += (1000 - xPos) - segmentWidth;
        }

        const yDelta = randomInt(randomSeed + xPos, 10, 30);
        const yPos = (up ? 800 - yDelta : 800 + yDelta);
        
        shorelineCurves = shorelineCurves + "C " + xPos + " 800, " + (xPos + segmentWidth / 2) + " " + yPos + ", " + (xPos + segmentWidth) + " 800\n\r";

        xPos += segmentWidth;
        up = !up;
    }
    console.log("SHORELINE CURVES: " + shorelineCurves);

    const slope = randomInt(randomSeed, 1, 10);
    const baseFrequency1 = randomInt(randomSeed * 2, 3, 9);
    const water = `
        <filter id='water'>
            <feTurbulence type='turbulence' 
                          baseFrequency='0.00` + baseFrequency1 + ` .11'
                          numOctaves='4' 
                          seed='` + randomSeed + `'
            />
            <feComponentTransfer result='wave'>
                <feFuncR type='linear' slope='0.1' intercept='-0.05' />
                <feFuncG type='gamma' 
                        amplitude='0.75' exponent='0.6' offset='0.05' />
                <feFuncB type='gamma' 
                        amplitude='0.8' exponent='0.4' offset='0.05'/>
                <feFuncA type='linear' slope='` + slope + `' />
            </feComponentTransfer>
            <feFlood flood-color='cyan' />
            <feComposite in='wave' />
            <feComposite in2='SourceAlpha' operator='in' />
        </filter>        
        <path d='M 0 1000
                 L 0 800
                ` + shorelineCurves + `
                 L 1000 800 
                 L 1000 1000' 
                filter='url(#water)' 
                stroke='clear'
                stroke-width='0' 
                fill-opacity='0.5'/>
    `;

    return water;
}

// ----------- RANDOM --------------

// Generate random int, inclusive of min/max, using same method as Solidity code
function randomInt(randomSeed, min, max) { 
    if (max <= min) {
        return min;
    }

    console.log(`RANDOM SEED: ${randomSeed}`);
    console.log(`MIN: ${min}`);
    console.log(`MAX: ${max}`);
    
    const bigSeed = BigInt(randomSeed);

    // const hash = ethers.solidityPackedKeccak256(["uint"], [bigSeed]);
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();

    const abiCodedSeed = abiCoder.encode(["uint"], [bigSeed]);
    const hash = keccak256(abiCodedSeed);

    console.log("HASH: " + hash);
    // const seed = parseInt(hash, 16);
    // const seed = BigInt("0x102030405060708090a0b0c0d0e0f000");
    const seed = BigInt(hash);

    console.log("SEED: " + seed);
    
    const value = seed % BigInt(max - min) + BigInt(min);

    console.log("VALUE: " + value);

    
    // const value = seed.mod(BigNumber.from(max - min)).add(BigNumber.from(min));
    // //   var value =  Math.floor(Math.random() * (max - min + 1) + min);

    const number = Number(value);
    console.log(`NUMBER: ${number}`)
    return number;

    // return 0;
}


function randomColour(randomSeed, tintColour) {
    
    console.log("RANDOM COLOUR SEED: " + randomSeed);

    const redRandom = randomInt(randomSeed, 0, 255);
    // const greenRandom = randomInt(randomSeed + 1, 0, 255);
    // const blueRandom = randomInt(randomSeed + 2, 0, 255);
    const greenRandom = randomInt(randomSeed + 2, 0, 255);
    const blueRandom = randomInt(randomSeed + 1, 0, 255);

    // if (tintColour == null) {
        const finalColour = "rgb(" + redRandom + ", " + greenRandom + ", " + blueRandom + ")";

        console.log("FINAL COLOUR: " + finalColour);

        return finalColour;
    // }

    // const redTint = tintColour.r;
    // const greenTint = tintColour.g;
    // const blueTint = tintColour.b;
    // const alpha = tintColour.a;

    // // alpha blending
    // const red = redRandom + (redTint - redRandom) * alpha;
    // const green = greenRandom + (greenTint - greenRandom) * alpha;
    // const blue = blueRandom + (blueTint - blueRandom) * alpha;

    // const finalColour = "rgb(" + redRandom + ", " + greenRandom + ", " + blueRandom + ")";

    // console.log("FINAL COLOUR: " + finalColour);

    // return finalColour;
}


// -------------- EXTERNAL ------------------

export default function buildAlienWorld(randomSeed) {
    console.log(`Generating artboard for alien world with seed: ${randomSeed}`);
    return generateArt(randomSeed);
}
