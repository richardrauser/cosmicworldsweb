// ---------------

// Generate random int, inclusive of min/max
function randomIntFromInterval(randomSeed, min, max) { 
    if (max <= min) {
        return min;
    }

    // regen random seed here to simulate behaviour of using hashing to generated new seed
    // randomSeed = Math.trunc(Math.random() * 5_000_000);

    const value = randomSeed % (max - min) + min;
    //   var value =  Math.floor(Math.random() * (max - min + 1) + min);
      return value;
}

function generateRandomArtDataUri() {
    // const randomSeed = Math.trunc(Math.random() * 5_000_000);
    const randomSeed = 1234;

    console.log("!");
    const svgString = encodeURIComponent(generateArt(randomSeed));
    return `data:image/svg+xml,${svgString}`;
}

function generateArt(randomSeed) {
    console.log("Generating art: " + randomSeed);

    // const gradient = `<radialGradient id="planetGradient">
    //                     <stop offset="10%" stop-color="gold" />
    //                     <stop offset="95%" stop-color="red" />
    //                   </radialGradient>`;


    var defs = "<defs><clipPath id='masterClip'><rect x='0' y='0' width='1000' height='1000'/></clipPath>"
    // defs += gradient;
    defs += `</defs>`;

// planets += gradient;

    const shapes = getShapes(randomSeed);

    const angle = randomIntFromInterval(randomSeed, 0, 360);
    const firstColour = getColour(randomSeed + 3);
    const secondColour = getColour(randomSeed + 3);
    const thirdColour = getColour(randomSeed + 3);
    const backgroundColour = `linear-gradient(${angle}deg, ${firstColour} 0%, ${secondColour} 35%, ${thirdColour} 100%)`;

    return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' style='background-image:" + backgroundColour + "'>" + defs + "<g clip-path='url(#masterClip)'>" + shapes + "</g></svg>";
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
    // shapes +=  " " + water;

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

// TODO: why seed2?
function getPlanets(seed2, tintColour) {

    const planetCount = randomIntFromInterval(seed2 * 2, 0, 5);

    var planets = "";

    for (var i = 0; i < planetCount; i++) {
        
        const randomSeed = (seed2 * 2) + i;

        const radius = randomIntFromInterval(randomSeed, 20, 200);
        const x = randomIntFromInterval(randomSeed, 50, 950);
        const y = randomIntFromInterval(randomSeed, 0, 500);

        const colour = getColour(randomSeed + 10 + i, tintColour);

        const stop1 = randomIntFromInterval(randomSeed, 3, 25);
        const colour1 = getColour(randomSeed + i, tintColour);
        const stop2 = randomIntFromInterval(randomSeed, 75, 97);
        const colour2 = getColour(randomSeed + i + 10, tintColour);
        // const colour2 = "grey";
        
        const fx = 50;// randomIntFromInterval(randomSeed, 1, 4) * 25;
        const fy = 50;// randomIntFromInterval(randomSeed, 1, 4) * 25;

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
        const fractal = randomIntFromInterval(randomSeed, 0, 10) > 5;
        const turbulenceType = fractal ? 'fractalNoise' : 'turbulence';
        // We intentionally make the y value larger than the x value
        // to create horizontal striping patterns
        const baseFrequencyX = randomIntFromInterval(randomSeed, 1, 4) / (radius * 2);
        const baseFrequencyY = randomIntFromInterval(randomSeed, 2, 4) / radius;
        const numOctaves = randomIntFromInterval(randomSeed, 3, 10);
        const seed = Math.random();

        // And some random values for our lighting
        const elevation = randomIntFromInterval(randomSeed, 30, 100);
        const surfaceScale = randomIntFromInterval(randomSeed, 5, 10);

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

    const mountainColour = getColour(randomSeed + 3, tintColour);
    const midColourPoint = randomIntFromInterval(randomSeed, 10, 90);
    const mountainColour2 = getColour(randomSeed + 5, tintColour);

    const gradient = `<defs><linearGradient id="mountainGradient">
                            <stop offset="5%" stop-color="` + mountainColour + `" />
                            <stop offset="` + midColourPoint + `%" stop-color="` + mountainColour2 + `" />
                            <stop offset="95%" stop-color="` + mountainColour + `" />
                        </linearGradient></defs>`;


    const baseFrequency = randomIntFromInterval(randomSeed, 1, 3);
    const scale = randomIntFromInterval(randomIntFromInterval, 1, 3);
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

    mountain += `<polygon points="` + polygonPoints + `"
                        filter="url('#mountainFilter')"
                        />`;
    mountain += `<polygon points="` + polygonPoints + `"
                            fill="url('#mountainGradient')"
                            opacity="0.7"
                            />`;
    mountain += `<polygon points="` + polygonPoints + `"
                        filter="url('#shadingFilter')"
                        opacity="0.5"
                        />`;

    return mountain;
}


function buildLine(randomSeed, width, pointCount) {
    const yOffset = 500;
    const interval = width / (pointCount - 1);

    console.log("INTERVAL: " + interval);

    var points = [];
    var currentY = yOffset;

    for (var i = 0; i <= pointCount; i++) {
        const x = i * interval;

        const yChange = randomIntFromInterval(randomSeed + i, 0, 20);
        const up = randomIntFromInterval(randomSeed + i, 0, 100) >  50;

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
    // const baseFrequency1 = randomIntFromInterval(randomSeed * 2, 1, 50) / baseFrequencyDenominator;
    // const baseFrequency2 = randomIntFromInterval(randomSeed * 3, 1, 50) / baseFrequencyDenominator;
    // const baseFrequency = baseFrequency1 + " " + baseFrequency2; 
    // const baseFrequency = "0.01 0.5";
    const baseFrequency = "0.002 0.014";
    const opacity = randomIntFromInterval(randomSeed * 5, 30, 80);
    console.log("Base frequency: " + baseFrequency);

    const clouds = `
        <filter id='filter'>
            <feTurbulence type='fractalNoise' 
                          baseFrequency='${baseFrequency}' 
                          numOctaves='200' 
                          seed='${randomSeed}'
                          />
        </filter>
        <rect width='100%' height='100%' opacity='${opacity}%' filter='url(#filter)'/>`;

    return clouds;
}

function getWater(randomSeed) {
    const curveCount = randomIntFromInterval(randomSeed, 1, 10);

    var shorelineCurves = "";
    const segmentWidthMin = 100;
    const segmentWidthMax = 400;
    var xPos = 0;
    var yPos = 800;
    var up = true;

    while (xPos < 1000) {
        var segmentWidth = randomIntFromInterval(randomSeed + xPos, segmentWidthMin, segmentWidthMax);
        
        if (segmentWidth > 1000 - xPos) {
            segmentWidth = 1000 - xPos;
        } else if ((1000 - xPos) - segmentWidth < segmentWidthMin) {
            segmentWidth += (1000 - xPos) - segmentWidth;
        }

        const yDelta = randomIntFromInterval(randomSeed + xPos, 10, 30);
        const yPos = (up ? 800 - yDelta : 800 + yDelta);
        
        const newCurve = "C " + xPos + " 800, " + (xPos + segmentWidth / 2) + " " + yPos + ", " + (xPos + segmentWidth) + " 800\n\r";

        shorelineCurves += newCurve;
        xPos += segmentWidth;
        up = !up;
    }
    console.log("SHORELINE CURVES: " + shorelineCurves);

    const slope = randomIntFromInterval(randomSeed, 1, 10)
    const baseFrequency1 = randomIntFromInterval(randomSeed * 2, 3, 9);
    const water = `
        <filter id="water">
            <feTurbulence type="turbulence" 
                          baseFrequency="0.00` + baseFrequency1 + ` .11"
                          numOctaves="4" 
                          seed="` + randomSeed + `"
            />
            <feComponentTransfer result="wave">
                <feFuncR type="linear" slope="0.1" intercept="-0.05" />
                <feFuncG type="gamma" 
                        amplitude="0.75" exponent="0.6" offset="0.05" />
                <feFuncB type="gamma" 
                        amplitude="0.8" exponent="0.4" offset="0.05"/>
                <feFuncA type="linear" slope="` + slope + `" />
            </feComponentTransfer>
            <feFlood flood-color="cyan" />
            <feComposite in="wave" />
            <feComposite in2="SourceAlpha" operator="in" />
        </filter>        
        <path d="M 0 1000
                 L 0 800
                ` + shorelineCurves + `
                 L 1000 800 
                 L 1000 1000" 
                filter="url(#water)" 
                stroke="clear"
                stroke-width="0" 
                fill-opacity="0.5"/>
    `;



    return water;
}

function getColour(randomSeed, tintColour) {
    const redRandom = randomIntFromInterval(randomSeed, 0, 255);
    const greenRandom = randomIntFromInterval(randomSeed + 2, 0, 255);
    const blueRandom = randomIntFromInterval(randomSeed + 1, 0, 255);

    if (tintColour == null) {
        return "rgb(" + redRandom + ", " + greenRandom + ", " + blueRandom + ")";
    }

    const redTint = tintColour.r;
    const greenTint = tintColour.g;
    const blueTint = tintColour.b;
    const alpha = tintColour.a;

    // alpha blending
    const red = redRandom + (redTint - redRandom) * alpha;
    const green = greenRandom + (greenTint - greenRandom) * alpha;
    const blue = blueRandom + (blueTint - blueRandom) * alpha;

    const finalColour = "rgb(" + red + ", " + green + ", " + blue + ")";

    return finalColour;
}

export default function buildAlienWorld() {
    console.log("Generating artboard.. ");
    const svgDataUri = generateRandomArtDataUri();
    console.log(svgDataUri);
    return svgDataUri;
}
