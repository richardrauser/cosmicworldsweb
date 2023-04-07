import TokenCard from "@components/TokenCard";
import TokenCardBig from "@components/TokenCardBig";
import { useRouter } from "next/router";

export default function Token({params}) {

    console.log("PARAMS: ", JSON.stringify(params));
    const router = useRouter();
    const id = router.query.id;

    console.log("TOKEN ID : " + id);
    
    return (
        <div>
            <div className="contentPanel">
                <h1>Cosmic Worlds NFT</h1>
            </div>
            <div className="contentPanel">
                <TokenCardBig id={ id }/>
            </div>
        </div>
    )
}