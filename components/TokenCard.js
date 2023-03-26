import React from 'react';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { getReadOnlyContract } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import Link from 'next/link'

class TokenCard extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
      }
  
      this.fetchMetadata = this.fetchMetadata.bind(this);
    }

    async fetchMetadata() {

      const tokenId = this.props.tokenId;
 
        console.log("Getting SVG for token ID: " + tokenId);
  
        try {
          const contract = await getReadOnlyContract();
    
          const metadataDataUri = await contract.tokenURI(tokenId);
          
          var metadataJson = "";

          if (metadataDataUri.startsWith("data:text/plain,")) {
            metadataJson = metadataDataUri.replace("data:text/plain,", "");          

          } else if (metadataDataUri.startsWith("data:application/json;base64,")) {
            const metadataJsonBase64Encoded = metadataDataUri.replace("data:application/json;base64,", "");          
            let buffer = new Buffer(metadataJsonBase64Encoded, 'base64');

            metadataJson = buffer.toString('utf-8');
          }

          const metadataObject = JSON.parse(metadataJson);


          const svg = metadataObject.image.replace("data:image/svg+xml,", "");
          const encodedSvg = encodeURIComponent(svg);
          const svgDataUri = `data:image/svg+xml,${encodedSvg}`;

          console.log("SVG: " + svg);

          // const traitsText = buildTraitsText(metadataObject);
          const traitsText = "incredible, magical alien world";

          this.setState({
            loading: false,
            svg: svg,
            tokenSvgDataUri: svgDataUri,
            traitsText: traitsText,
          });
  
        } catch (err) {
          handleError(err);
        }
      }
    
      componentDidMount() {
        this.fetchMetadata();
      }
    
      render() {

        const tokenId = this.props.tokenId;
        const link = "/token/" + tokenId;

        if (this.state.loading === true) {
              return (
                  <Card key={tokenId} className="tokenCard">
                  <Card.Header>
                  {/* <Link href={link}> */}
                  Token ID: {tokenId}
                  {/* </Link> */}
                  </Card.Header>
                  <Card.Body>
                  <Card.Title>
                  </Card.Title>
                  {/* <Link href= {link}> */}
                      <div className="cardArtwork"> 
                        <Spinner animation="grow" />
                      </div>   
                    {/* </Link> */}
                  </Card.Body>
              </Card>        
              );
          } else {
                      

              return (
                  <Card key={tokenId} className="tokenCard">
                      <Card.Header>
                          {/* <Link to= {link}> */}
                            Token ID: {tokenId}
                          {/* </Link> */}
                      </Card.Header>
                      <Card.Body>
                      <Card.Title>
                      </Card.Title>
                      {/* <Link to= {link}> */}
                        <div className="cardArtwork" tokenId={tokenId}>
                            <Link href= { "/token/" + tokenId }>
                              <img className="galleryImage" alt={ "Cosmic Worlds token " + tokenId } src={ this.state.tokenSvgDataUri } />
                            {/* { this.state.svg } */}
                            </Link>
                        </div>
                      {/* </Link> */}
                      <div className="cardTraits">
                      { this.state.traitsText }
                      </div>
                      </Card.Body>
                  </Card>        

              );
          }
      }
  }

  export default TokenCard;
