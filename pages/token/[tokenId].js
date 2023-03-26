import TokenCard from "@components/TokenCard";
import { useRouter } from "next/router";

export default function Token() {

    const router = useRouter();
    const tokenId = router.query.tokenid;

    console.log("TOKEN ID : " + tokenId);
    
    return (
        <div>
            <h1>Token # { tokenId }</h1>
            <TokenCard tokenId={ tokenId }/>
        </div>
    )
}