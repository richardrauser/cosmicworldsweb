import React from 'react';

export default function AlienWorldzSpan() {
    if (this.props.link !== undefined && this.props.link === true) {
        return (
            <a className="externalLink" href="https://www.alienworldz.xyz/" target="_blank" rel="noreferrer">
                <span className="alienWorldz">Alien Worldz</span>
            </a>
        )
          
    } else {
        return (
            <span className="alienWorldz">Alien Worldz</span>
        )
    }

}

