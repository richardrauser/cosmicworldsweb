import { fetchRecentTokenIds, fetchTotalSupply } from '../../utils/BlockchainAPI';

export default async function handler(req, res) {

    try {
        const totalSupply = await fetchTotalSupply();
        const recentTokenIds = await fetchRecentTokenIds();
        res.status(200).json({ 
            totalSupply: Number(totalSupply),
            recent: recentTokenIds 
        });    
    } catch (error) {
        console.log("Error fetching total supply: " + error);
        const errorMessage = String(error);
    
        res.status(500).json({ error: errorMessage });
    }
}
 