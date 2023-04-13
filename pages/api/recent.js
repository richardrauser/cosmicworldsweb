// import { CosmicWorldsContractAddress } from '../../utils/Constants';
// import {Alchemy, Network} from '@alch/alchemy-web3';

// export default async function handler(req, res) {
//   const settings = {
//     apiKey: process.env['ALCHEMY_API_KEY'],
//     network: Network.ETH_MAINNET,
//   };
//   const alchemy = new Alchemy(settings);

//   const allNfts = await alchemy.nft.getNftsForContract(CosmicWorldsContractAddress);
//   const supply = allNfts.nfts.length;

//   var recentNfts = (supply <= 5) ? allNfts.nfts : allNfts.nfts.slice(supply - 5);

//   res.status(200).json({ totalSupply: supply, recent: recentNfts });
// }
