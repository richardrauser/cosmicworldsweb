import React from 'react';

import TokenCard from './TokenCard';


function TokenList(props) {
    const tokens = props.tokens;
    const listItems = tokens.map((token) =>
      <TokenCard key={token.toString()} tokenid={token.toString()}/>
    )
    return (
      <div className="tokenList">
          {listItems}
        </div>
    );
  }
  
  export default TokenList;

