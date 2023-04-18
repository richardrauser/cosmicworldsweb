// import { CosmicWorldsContractAddress } from '../../utils/Constants';
// import {Alchemy, Network} from '@alch/alchemy-web3';
import { fetchTotalSupply } from '../../utils/BlockchainAPI';

export default async function handler(req, res) {

    try {
        const totalSupply = fetchTotalSupply();
        res.status(200).json({ totalSupply: totalSupply });    
    } catch (error) {
        console.log("Error fetching total supply: " + error);
        res.status(500).json({ error: error });
    }
}
