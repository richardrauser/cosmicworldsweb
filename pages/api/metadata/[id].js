import { fetchTokenDetails } from 'utils/BlockchainAPI';
import fs from "fs";

export default async function handler(req, res) {
    try {
        const tokenId = req.query.id;
        const fileName = "public/metadata/" + tokenId + ".json";

        let details;

        if (fs.existsSync(fileName)) {
            console.log("Found file with name: " + fileName);
            const file = fs.readFileSync(fileName);
            details = JSON.parse(file);
        } else {
            console.log("File not found with name: " + fileName + " Reading from blockchain...");
            details = await fetchTokenDetails(tokenId);
            fs.writeFileSync(fileName, JSON.stringify(details));
        }

        console.log("Returning token details: " + details);
        res.status(200).json({ 
            tokenDetails: details
        });    
    } catch (error) {
        console.log("Error fetching token details: " + error);
        res.status(500).json({ error: error });
    }
}
