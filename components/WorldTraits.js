import React from 'react';

// The one place a world's traits get rendered, whether they came from a minted
// token's tokenURI or were derived from a not-yet-minted seed. Both sides pass
// the same keys, so a world reads identically before and after minting.
export default function WorldTraits(props) {
  const { seed, planetCount, starDensity, mountainRoughness, waterChoppiness, cloudType } = props;

  return (
    <div className="cardTraits">
      Seed: { seed } <br />
      Planets: { planetCount } <br />
      Stars: { starDensity } <br />
      Mountains: { mountainRoughness } <br />
      Water: { waterChoppiness } <br />
      Clouds: { cloudType } <br />
    </div>
  );
}
