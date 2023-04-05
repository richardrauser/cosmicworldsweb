import React from 'react';

export default function CosmicSpan(props) {
    if (props.link !== undefined && props.link === true) {
        return (
            <a className="externalLink" href="https://www.cosmicworlds.xyz/" target="_blank" rel="noreferrer">
                <span className="cosmicworlds">Cosmic Worlds</span>
            </a>
        )
          
    } else {
        return (
            <span className="cosmicWorlds">Cosmic Worlds</span>
        )
    }

}

