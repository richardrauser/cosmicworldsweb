import TokenCard from "@components/TokenCard";



export default function Token() {

    const tokenId = 1;
    
    return (
        <div>
            <h1>Token # { tokenId }</h1>
            <TokenCard tokenId= { tokenId }/>
        </div>
    )
}