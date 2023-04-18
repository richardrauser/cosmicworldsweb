import { fetchTokenDetails } from 'utils/BlockchainAPI';
import { fetchRecentTokenIds, fetchTotalSupply } from '../../../utils/BlockchainAPI';
import { useRouter } from 'next/router';

export default async function handler(req, res) {
    const tokenId = req.query.id;

    try {
        const details = await fetchTokenDetails(tokenId);

        res.status(200).json({ 
            tokenDetails: details
        });    
    } catch (error) {
        console.log("Error fetching token details: " + error);
        res.status(500).json({ error: error });
    }
}
