import { fetchTokenDetails } from 'utils/BlockchainAPI';
import fs from "fs";

export default async function handler(req, res) {
    try {
        const tokenId = req.query.id;
        const dir = "metadata";
        // if (!fs.existsSync(dir)) {
        //     fs.mkdirSync(dir);
        // }
        const fileName = dir + "/" + tokenId + ".json";

        let details;

        if (fs.existsSync(fileName)) {
            console.log("Found file with name: " + fileName);
            const file = fs.readFileSync(fileName);
            details = JSON.parse(file);
        } else {
            console.log("File not found with name: " + fileName + " Reading from blockchain...");
            details = await fetchTokenDetails(tokenId);
            // console.log("Writing token details to file: " + fileName);
            // fs.writeFileSync(fileName, JSON.stringify(details));
        }

        // A token's metadata derives from an immutable on-chain seed, so it
        // never changes. Cache it at the CDN: the gallery pages request one of
        // these per card, so /recent alone was 12 Alchemy calls per view.
        // A day of freshness keeps deploys of this route's own post-processing
        // effective, while stale-while-revalidate absorbs the long tail.
        res.setHeader(
            "Cache-Control",
            "public, s-maxage=86400, stale-while-revalidate=604800"
        );
        res.status(200).json({ 
            tokenDetails: details
        });    
    } catch (error) {
        console.log("Error fetching token details: " + error);
        // Don't let a failure be cached, and stringify the error - an Error
        // instance serialises to {} through res.json.
        res.setHeader("Cache-Control", "no-store");
        res.status(500).json({ error: String(error) });
    }
}
