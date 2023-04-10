import { ethers, keccak256 } from 'ethers';

function buildDataUri() {
    const randomSeed = Math.trunc(Math.random() * 5_000_000);
    return build(randomSeed);
}

function build(randomSeed) {
    console.log("Building: " + randomSeed);

    const angle = randomInt(randomSeed, 0, 360);
    const firstColour = randomColour(randomSeed + 1);
    const secondColour = randomColour(randomSeed + 2);
    const thirdColour = randomColour(randomSeed + 3);
    const bgGradient = `linear-gradient(${angle}deg, ${firstColour} 0%, ${secondColour} 35%, ${thirdColour} 100%)`;

    const defs = `<defs><clipPath id='mcp'><rect x='0' y='0' width='1e3' height='1e3'/></clipPath></defs>`;

    var shapes = "";
    shapes += getStars(randomSeed);
    shapes += " " + getPlanets(randomSeed);
    shapes += " " + getMountains(randomSeed);
    // shapes += " " + getWater(randomSeed);
    shapes += " " + getClouds(randomSeed);

    const svgString = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1e3 1e3' style='background-image:${bgGradient}'>${defs}<g clip-path='url(#mcp)'>${shapes}</g></svg>`;
    console.log(`SVG: ${svgString}`);
    const encodedSvg = encodeURIComponent(svgString);

    return `data:image/svg+xml,${encodedSvg}`;
}

function getStars(randomSeed) {
    return `
        <filter id='sf'>
        <feTurbulence baseFrequency='0.${randomInt(randomSeed, 15, 40)}' seed='${randomSeed}'/>
        <feColorMatrix values='0 0 0 9 -4 
                            0 0 0 9 -4 
                            0 0 0 9 -4 
                            0 0 0 0 1'/>
        </filter>
        <rect width='100%' height='100%' opacity='50%' filter='url(#sf)'/>
        `;
}

function getPlanetCount(planetSeed) {
    return randomInt(planetSeed * 2, 0, 5);
}

function getPlanets(planetSeed, tintColour) {

    var planets = "";

    for (var i = 0; i < getPlanetCount(planetSeed); i++) {
        
        const randomSeed = planetSeed * 2 + i;

        const radius = randomInt(randomSeed, 20, 200);
        const x = randomInt(randomSeed, 50, 950);
        const y = randomInt(randomSeed, 0, 500);

        const stop1 = randomInt(randomSeed, 3, 25);
        const colour1 = randomColour(randomSeed + i, tintColour);
        const stop2 = randomInt(randomSeed, 75, 97);
        const colour2 = randomColour(randomSeed + i + 10, tintColour);
        
        const fx = 50;// randomInt(randomSeed, 1, 4) * 25;
        const fy = 50;// randomInt(randomSeed, 1, 4) * 25;
x
        // from https://cloudfour.com/thinks/generating-solar-systems-part-2-filters-gradients-and-clip-paths/
        const turbulenceType = randomInt(randomSeed, 0, 10) > 5 ? 'fractalNoise' : 'turbulence';
        // We intentionally make the y value larger than the x value
        // to create horizontal striping patterns
        const baseFrequencyX = Math.trunc(randomInt(randomSeed, 1, 4) * 1e3 / (radius * 2));
        const baseFrequencyY = Math.trunc(randomInt(randomSeed, 2, 4) * 1e3 / radius);
        const numOctaves = randomInt(randomSeed, 3, 10);

        // And some random values for our lighting
        const elevation = randomInt(randomSeed, 30, 100);
        const surfaceScale = randomInt(randomSeed, 5, 10);

        const gradient = `<defs><radialGradient id='pg${i}' fx='${fx}%' fy='${fy}%'>
            ${stopOffset(stop1, colour1)}
            ${stopOffset(stop2, colour2)}
            </radialGradient></defs>`;

        // make filter bigger than planet so we don't crop blur. default is 10/120.
        const filter = `<filter id='pf${i}' x='-25%' y='-25%' width='150%' height='150%'> 
            <feTurbulence
                type='${turbulenceType}' 
                baseFrequency='0.00${baseFrequencyX} 0.0${baseFrequencyY}' 
                seed='${randomSeed}' 
                numOctaves='${numOctaves}' 
            />
            <feDiffuseLighting lighting-color='${colour1}' surfaceScale='${surfaceScale}'>
                <feDistantLight elevation='${elevation}' />
            </feDiffuseLighting>
            <feComposite result='p' operator='in' in2='SourceGraphic'/>
            <feGaussianBlur stdDeviation="8" result="b"/>
            <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="p"/>
            </feMerge>
        </filter>`;

        console.log("PLANET FILTER: " + filter);
          
        planets += gradient;
        planets += filter;
        planets += `<circle cx='${x}' cy='${y}' r='${radius}' filter='url(#pf${i})'/>
                    <circle cx='${x}' cy='${y}' r='${radius}' fill='url(#pg${i})' opacity='40%'/>`;
        
    }

    return planets;
}

function getMountains(randomSeed, tintColour) {
    var polygonPoints = buildLine(randomSeed, 1e3, 51);

    polygonPoints = polygonPoints.join(" ");
    polygonPoints += " 1e3,1e3 -1,1e3";

    console.log("POINTS: \n " + polygonPoints);

    const mountainColour = randomColour(randomSeed + 3, tintColour);
    const midColourPoint = randomInt(randomSeed, 10, 90);
    const mountainColour2 = randomColour(randomSeed + 5, tintColour);

    const gradient = `<defs><linearGradient id="mg">
        ${stopOffset(5, mountainColour)}
        ${stopOffset(midColourPoint, mountainColour2)}
        ${stopOffset(95, mountainColour)}
        </linearGradient></defs>`;

        // TODO: try removing diffuse lighting for cool clouds on mountain
    const filter = `<filter id='mf'>
                        <feTurbulence type='fractalNoise' baseFrequency='0.0${randomInt(randomSeed, 1, 3)}' numOctaves='15'/>
                        <feDiffuseLighting lighting-color='white' surfaceScale='${randomInt(randomSeed, 1, 3)}'>
                            <feDistantLight azimuth='45' elevation='10'/>
                        </feDiffuseLighting>
                        <feComposite result='m' operator='in' in2='SourceGraphic'/>
                        <feGaussianBlur stdDeviation='8'/>
                        <feColorMatrix type='matrix' values='
                        0 0 0 0 0 
                        0 0 0 0 0 
                        0 0 0 0 0 
                        0 0 0 0.5 0' 
                        result='b'
                        />
                        <feMerge>
                            <feMergeNode in='m'/>
                            <feMergeNode in='b'/>
                        </feMerge>
                    </filter>`;
// under gaussian blur above

    const shadingFilter = `<filter id='msf'>
                            <feTurbulence type='fractalNoise' 
                                baseFrequency='0.004 0.01' 
                                numOctaves='2' 
                                seed='${randomSeed}'
                            />
                            <feColorMatrix values='0 1 0 0 -4 1 1 0 0 -4 1 0 0 0 -4 0 1 1 0 -1'/>
                            <feComposite operator='in' in2='SourceGraphic'/>
                            </filter>
                        `;
    
    var mountain = "";
    mountain += filter;
    mountain += gradient;
    mountain += shadingFilter;

    const opacity = randomInt(randomSeed, 40, 70);    

    mountain += `<polygon points='${polygonPoints}' filter='url(#mf)'/>`;
    mountain += `<polygon points='${polygonPoints}' fill='url(#mg)' opacity='${opacity}%'/>`;
    mountain += `<polygon points='${polygonPoints}' filter='url(#msf)'/>`;

    return mountain;
}

function stopOffset(offset, color) {
    return `<stop offset="${offset}%" stop-color="${color}" />`;
}

function buildLine(randomSeed, width, pointCount) {
    const interval = width / (pointCount - 1);

    console.log("INTERVAL: " + interval);

    var points = [];
    var currentY = 500; // starting currentY is y offset

    for (var i = 0; i <= pointCount - 1; i++) {
        const x = i * interval;

        const pointSeed = (randomSeed + i) + 1e3;
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

    // const baseFrequencyDenominator = 1e3;
    // const baseFrequency1 = randomInt(randomSeed * 2, 1, 50) / baseFrequencyDenominator;
    // const baseFrequency2 = randomInt(randomSeed * 3, 1, 50) / baseFrequencyDenominator;
    // const baseFrequency = baseFrequency1 + " " + baseFrequency2; 
    // const baseFrequency = "0.01 0.5";
    const baseFrequency = "0.002 0.02";
    const opacity = randomInt(randomSeed * 5, 50, 80);
    console.log("Base frequency: " + baseFrequency);

    return `
        <filter id='cf'>
            <feTurbulence type='fractalNoise' 
                          baseFrequency='${baseFrequency}' 
                          numOctaves='2' 
                          seed='${randomSeed}'
                          />
        </filter>
        <rect width='100%' height='100%' opacity='${opacity}%' filter='url(#cf)'/>`;
}

function getWater(randomSeed) {

    var shorelineCurves = "";
    const segmentWidthMax = 400;
    var xPos = 0;
    var up = true;

    while (xPos < 1e3) {
        var segmentWidth = randomInt(randomSeed + xPos, 100, 400);
        
        if (segmentWidth > 1e3 - xPos) {
            segmentWidth = 1e3 - xPos;
        } else if ((1e3 - xPos) - segmentWidth < 100) {
            // TODO: is there a max function in Solidity?
            segmentWidth += (1e3 - xPos) - segmentWidth;
        }

        const yDelta = randomInt(randomSeed + xPos, 10, 30);
        const yPos = (up ? 800 - yDelta : 800 + yDelta);
        
        shorelineCurves = shorelineCurves + 
            "C " + 
            xPos + 
            " 800, " + 
            (xPos + segmentWidth / 2) + 
            " " + 
            yPos + 
            ", " + 
            (xPos + segmentWidth) + 
            " 800 ";

        xPos += segmentWidth;
        up = !up;
    }
    console.log("SHORELINE CURVES: " + shorelineCurves);

    const slope = randomInt(randomSeed, 1, 10);
    const baseFrequency1 = randomInt(randomSeed * 2, 3, 9);
    
    return `
        <filter id='wf'>
            <feTurbulence baseFrequency='0.00${baseFrequency1} .11'
                          numOctaves='4' 
                          seed='${randomSeed}'
            />
            <feComponentTransfer result='wave'>
                <feFuncR type='linear' slope='0.1' intercept='-0.05' />
                <feFuncG type='gamma' amplitude='0.75' exponent='0.6' offset='0.05' />
                <feFuncB type='gamma' amplitude='0.8' exponent='0.4' offset='0.05'/>
                <feFuncA type='linear' slope='${slope}' />
            </feComponentTransfer>
            <feFlood flood-color='cyan' />
            <feComposite in='wave' />
            <feComposite in2='SourceAlpha' operator='in' />
        </filter>        
        <path d='M 0 1e3
                 L 0 800
                ` + shorelineCurves + `
                 L 1e3 800 
                 L 1e3 1e3' 
                filter='url(#wf)' 
                fill-opacity='70%'/>
    `;
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

export default function buildCosmicWorld(randomSeed) {
    console.log(`Generating artboard for alien world with seed: ${randomSeed}`);
    return build(randomSeed);
}