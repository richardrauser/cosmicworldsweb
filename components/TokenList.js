import React from 'react';
import TokenCard from './TokenCard';
import CosmicSpan from './CosmicSpan';
import Link from 'next/link';

function TokenList(props) {
    const tokens = props.tokens;
    console.log("TOKENS: " + tokens)
    const listItems = tokens.map((token) =>
      <TokenCard key={token.toString()} tokenid={token.toString()}/>
    )
    return ( listItems.length > 0 ? ( 
      <div className="tokenList">
          {listItems}
        </div>

    ) : ( 
      <div className="contentPanel">
        No <CosmicSpan/> yet. Go to the <Link href="/">Home page</Link> and start minting!
      </div>
    ));
  }
  
  export default TokenList;

