// ---------------

// Generate random int, inclusive of min/max
function randomIntFromInterval(randomSeed, min, max) { 
    if (max <= min) {
        return min;
    }

    // regen random seed here to simulate behaviour of using hashing to generated new seed
    randomSeed = Math.trunc(Math.random() * 5_000_000);

    const value = randomSeed % (max - min) + min;
    //   var value =  Math.floor(Math.random() * (max - min + 1) + min);
      return value;
}

function generateRandomArtDataUri() {
    const randomSeed = Math.trunc(Math.random() * 5_000_000);
    const randomZoom = randomIntFromInterval(randomSeed, 0, 100);

    const tintColour = null; // getColour(randomSeed, null);

    const svgString = encodeURIComponent(generateArt(randomSeed, randomZoom, tintColour, 0, 180, 25, 250, 25, 250));
    return `data:image/svg+xml,${svgString}`;
}

function generateArt(randomSeed, zoom, tintColour, rotationDegrees, rotationVariation, widthMin, widthMax, speedMin, speedMax) {
    console.log("Generating art: " + randomSeed + " " + zoom + " " + rotationDegrees + " "  + rotationVariation + " " + widthMin + " " + widthMax + " " + speedMin + " " + speedMax);

    if (tintColour === null) {
        tintColour = { r: 0, g: 0, b: 0, a: 0 };
    }

    const viewBoxClipRect = getViewBoxClipRect(zoom);
    const viewBox = viewBoxClipRect[0];
    const clipRect = viewBoxClipRect[1];
    const rendering = rotationVariation === 0 ? 'crispEdges' : 'auto';

    // const gradient = `<radialGradient id="planetGradient">
    //                     <stop offset="10%" stop-color="gold" />
    //                     <stop offset="95%" stop-color="red" />
    //                   </radialGradient>`;


    var defs = "<defs><clipPath id='masterClip'><rect " + clipRect + "/></clipPath>"
    // defs += gradient;
    defs += `</defs>`;

// planets += gradient;

    const shapes = getShapes(randomSeed, tintColour, rotationDegrees, rotationVariation, widthMin, widthMax, speedMin, speedMax);

    // const backgroundColour = "yellow";
    const firstColour = getColour(randomSeed + 3, tintColour);
    const secondColour = getColour(randomSeed + 3, tintColour);
    const thirdColour = getColour(randomSeed + 3, tintColour);
    const backgroundColour = "linear-gradient(135deg, " + firstColour + " 0%, " + secondColour + " 35%, " + thirdColour + " 100%)";
    // const backgroundColour = "";
    // const backgroundColour = "linear-gradient(red, yellow)";

    return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='" + viewBox + "' shape-rendering='" + rendering + "' style='background-image:" + backgroundColour + "'>" + defs + "<g clip-path='url(#masterClip)'>" + shapes + "</g></svg>";
}

function getViewBoxClipRect(zoom) {
    zoom = zoom * 10;
    const widthHeight = 500 + zoom;
    var viewBox = "";
    var clipRect = "";
    var offset = (zoom - 500) / 2;

    if (zoom > 500) {
        viewBox = "-" + offset + " -" + offset + " " + widthHeight + " " + widthHeight;
        clipRect = "x='-" + offset + "' y='-" + offset  + "' width='" + widthHeight + "' height='" + widthHeight + "'";
        
    } else {
        offset = (zoom === 500 ? 0 : (500 - zoom) / 2);
        viewBox = "" + offset + " " + offset + " " + widthHeight + " " + widthHeight;
        clipRect = "x='" + offset + "' y='" + offset + "' width='" + widthHeight + "' height='" + widthHeight + "'";
    }

    viewBox = "0 0 1000 1000";
    clipRect = "x='0' y='0' width='1000' height='1000'";
    
    console.log("View box: " + viewBox);
    console.log("clip rect: " + clipRect);

    return [viewBox, clipRect];
}

function getShapes(randomSeed, tintColour, rotationDegrees, rotationRange, widthMin, widthMax, speedMin, speedMax) {

    const pinewoodShapes = `   
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".3 .01"/>
        <feColorMatrix values="0 0 0 .11 .69
                            0 0 0 .09 .38
                            0 0 0 .08 .14
                            0 0 0 0 1"/>
    </filter>
    <rect width="100%" height="100%" opacity="50%" filter="url(#filter)"/>`;

    const stars = getStars(randomSeed);
    const planets = getPlanets(randomSeed, tintColour);
    const mountain = getMountains(randomSeed, tintColour);
    const clouds = getClouds(randomSeed);
    const water = getWater(randomSeed);

    // <polygon filter="url(#water)" opacity="50%" points="1000,950, 1000,1000 0,1000 0,900"/>

    var shapes = "";
    shapes += stars;
    shapes += " " + planets;
    shapes += " " + mountain;
    shapes += " " + clouds;
    shapes +=  " " + water;

    return shapes;

    var stripeWidth = randomIntFromInterval(randomSeed, widthMin, widthMax) * 2;

    // stripeWidth = 5;

    var xPos = 0;
    var x1 = 0;
    var y1 = 1000;
    var x2 = 0;
    var y2 = 1000;
    var x3 = 1000;
    var y3 = 1000;

    while ((1000 - xPos) > 0) {


        // if (stripeWidth > 1000 - xPos) {
        //     stripeWidth = 1000 - xPos;
        // } else if ((1000 - xPos) - stripeWidth < widthMin) {
        //     stripeWidth += (1000 - xPos) - stripeWidth;
        // }

        // const rotation = getRotation(randomSeed + 1, rotationDegrees, rotationRange);
        // const speed = randomIntFromInterval(randomSeed + 2, speedMin, speedMax) * 20;
        const firstColour = getColour(randomSeed + 3, tintColour);
        const secondColour = getColour(randomSeed + 13, tintColour);
        // const colours = firstColour + ";" + secondColour + ";" + firstColour;
    
        // var currentRect = "<rect x='" + xPos + "' y='0' width='" + stripeWidth + "' height='1000' fill='" + firstColour + "' opacity='0.8' transform='rotate(" + rotation + " 500 500)'>";
        // // currentRect += "<animate begin= '0s' dur='" + speed + "ms' attributeName='fill' values='" + colours + "' fill='freeze' repeatCount='indefinite'/>";
        // currentRect += "</rect>";

        var currentShape1 = "<polygon points='" + x1 + " " + y1 + ", " + x2 + " " + y2 + ", " + x3 + " " + y3 + "' fill='" + firstColour + "'/>";
        console.log("currentShape: " + currentShape1);
        shapes += currentShape1 + "\r\n";

        var currentShape2 = "<polygon points='" + y1 + " " + x1 + ", " + y2 + " " + x2 + ", " + y3 + " " + x3 + "' fill='" + firstColour + "'/>";
        console.log("currentShape2: " + currentShape2);
        shapes += currentShape2 + "\r\n";
         

        y1 -= stripeWidth;
        x3 -= stripeWidth;
        xPos += stripeWidth;
        randomSeed += 100;
        // break;
    }
 
    return shapes;
}
function getPlanets(randomSeed, tintColour) {

    const planetCount = randomIntFromInterval(randomSeed * 2, 0, 5);

    var planets = "";

    for (var i = 0; i < planetCount; i++) {

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
    const mountainColour = getColour(randomSeed + 3, tintColour);
    const mountainColour2 = getColour(randomSeed + 5, tintColour);
    console.log("MOUNTAIN COLOUR: " + mountainColour);

    const HEIGHT = randomIntFromInterval(randomSeed, 100, 300);
    const ITERATIONS = randomIntFromInterval(randomSeed, 5, 8);
    const ROUGHNESS = 0.85;

    const segments = Math.pow(2, ITERATIONS);
    // const segments = randomIntFromInterval(randomSeed, 200, 1000);

    var polygonPoints = buildLine(1000, displaceMap(HEIGHT, HEIGHT / 4, ROUGHNESS, segments));
    polygonPoints = polygonPoints.join(" ");
    polygonPoints += " 1000,1000 -1,1000";

    // points = `-1,329.2 39.5,265.1 50.8,274.1 61.9,253 86.9,230 98,206 124,198 131,187 137,204 165,167 
    // 188,157 198,141 207,112 220,89 235,73 246,82 263,100 270.5,138.5 290.5,157.5 297.5,183 337,216.5 369,258.3 399,266.3 
    // 425.7,263.7 442.3,291 449.7,280 461.7,301 501,337.7 1000,381.5 1000,1000 -1,1000 	" />`;

    // points += `<polygon fill="#D3CFCF" points="140,217.7 166,171.7 193,163 197.3,149.7 204,145.3 211,112.3 222.3,92 236.7,78.7 229,107.3 
    // 214.3,125.3 219.7,156.3 203,180.7 180,179.3`;
    
    console.log("POINTS: \n " + polygonPoints);
    const midColourPoint = randomIntFromInterval(randomSeed, 10, 90);

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

// generate midpoint displacement points
function displaceMap(height, displace, roughness, power) {
    const points = []
  
    // set initial left point
    points[0] = height / 2 + (Math.random() * displace * 2) - displace
  
    // set initial right point
    points[power] = height / 2 + (Math.random() * displace * 2) - displace
    displace *= roughness
  
    // increase number of segments to maximum
    for (let i = 1; i < power; i *= 2) {
      // for each segment, find centre point
      for (let j = (power / i) / 2; j < power; j += power / i) {
        points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2)
        points[j] += (Math.random() * displace * 2) - displace
      }
  
      // reduce random range
      displace *= roughness
    }
  
    return points
  }

// format points in [x, y] array
function buildLine(width, points) {
    const yOffset = 300;
    const sep = width / (points.length - 1)
    return points.map((val, i) => ([
      i * sep,
      val + yOffset
    ]))
  }

// convert points into SVG path
// function convertPath(width, height, points) {
//     // add first M (move) command
//     const first = points.shift()
//     let path = `M ${first[0]} ${first[1]}`
  
//     // iterate through points adding L (line) commands to path
//     points.forEach(val => {
//       path += ` L ${val[0]} ${val[1]}`
//     })
  
//     // close path
//     path += ` L ${width} ${height} L 0 ${height} Z`
  
//     return path
//   }
  

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

function getClouds(randomSeed) {

    const baseFrequencyDenominator = 1000;
    const baseFrequency1 = randomIntFromInterval(randomSeed * 2, 1, 50) / baseFrequencyDenominator;
    const baseFrequency2 = randomIntFromInterval(randomSeed * 3, 1, 50) / baseFrequencyDenominator;
    // const baseFrequency = baseFrequency1 + " " + baseFrequency2; 
    // const baseFrequency = "0.01 0.5";
    const baseFrequency = "0.002 0.014";
    console.log("Base frequency: " + baseFrequency);

    const matrixParam = 1; //randomIntFromInterval(randomSeed * 3, 0, 9)
    const clouds = `
        <filter id="filter">
            <feTurbulence type="fractalNoise" 
                          baseFrequency="` + baseFrequency + `" 
                          numOctaves="200" 
                          seed="` + randomSeed + `"
                          />
            <feColorMatrix values="9 4 0 9 -4
                                   3 2 ` + matrixParam + ` 2 -4
                                   4 6 0 9 -4
                                   0 0 0 0 1"/>
        </filter>
        <rect width="100%" height="100%" opacity="40%" filter="url(#filter)"/>`;

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

function getRotation(randomSeed, rotationDegrees, rotationRange) {
    const randomDegrees = randomIntFromInterval(randomSeed, 0, rotationRange);
    var rotation = 0;

    if (randomDegrees === 0) {
        rotation = rotationDegrees;
    } else if (randomDegrees < rotationRange) {
        rotation = 360 + rotationDegrees - randomDegrees + rotationRange / 2; 
    } else {
        rotation = rotationDegrees + randomDegrees - rotationRange / 2;
    }

    if (rotation > 360) {
        rotation = rotation - 360;
    }

    return rotation;
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
    // document.body.style.backgroundImage = svgDataUri;
    // document.getElementById("artboardImage").src = svgDataUri;
    return svgDataUri;
}
