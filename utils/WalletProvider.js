// Discovery and selection of an injected Ethereum wallet provider.
//
// Grabbing `window.ethereum` is not safe: when several wallet extensions are
// installed they race to claim that single property, and the winner is
// arbitrary. It may not be an Ethereum wallet at all - some reject even
// basic EIP-1193 calls ("Request method eth_chainId is not supported"),
// which surfaces in ethers as "could not coalesce error" - and even when it
// is, it may be sitting on an unrelated chain.
//
// So we enumerate every candidate - EIP-6963 announcements first, then the
// legacy `window.ethereum` / `window.ethereum.providers` injections - and let
// the user pick. Where a pick is needed before they've made one, we guess,
// preferring a wallet that is already on the network the site needs.

import * as Errors from "./ErrorMessages";
import { CosmicWorldsCurrentNetworkID } from "./Constants";

const PreferredWalletKey = "CW_PREFERRED_WALLET_KEY";

// rdns (or name) -> { info, provider }
const announcedWallets = new Map();

let isListening = false;
let selectedWallet = null;
// True once the user has picked a wallet themselves, which stops us
// second-guessing them - notably when their wallet is on the wrong network.
let selectionIsExplicit = false;

function startListeningForWallets() {
  if (isListening || typeof window === "undefined") {
    return;
  }
  isListening = true;

  window.addEventListener("eip6963:announceProvider", (event) => {
    const detail = event.detail;
    if (detail == null || detail.info == null || detail.provider == null) {
      return;
    }
    const key = detail.info.rdns || detail.info.name;
    announcedWallets.set(key, detail);
  });
}

// EIP-6963: wallets announce themselves in response to this event.
function requestWalletAnnouncements() {
  if (typeof window === "undefined") {
    return;
  }
  startListeningForWallets();
  window.dispatchEvent(new Event("eip6963:requestProvider"));
}

async function announcedWalletList() {
  requestWalletAnnouncements();

  // Announcements are dispatched synchronously by most wallets, but give
  // slower ones a moment to respond.
  if (announcedWallets.size === 0) {
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return Array.from(announcedWallets.values()).map((detail) => ({
    id: detail.info.rdns || detail.info.name,
    name: detail.info.name,
    icon: detail.info.icon || null,
    provider: detail.provider,
  }));
}

function legacyWalletList() {
  if (typeof window === "undefined" || window.ethereum == null) {
    return [];
  }

  // Some extensions expose every injected provider in `providers`.
  const providers = Array.isArray(window.ethereum.providers)
    ? window.ethereum.providers
    : [window.ethereum];

  return providers.filter(Boolean).map((provider) => ({
    id: null,
    name: legacyWalletName(provider),
    icon: null,
    provider,
  }));
}

function legacyWalletName(provider) {
  if (provider.isRabby) {
    return "Rabby";
  }
  if (provider.isPhantom) {
    return "Phantom";
  }
  if (provider.isCoinbaseWallet) {
    return "Coinbase Wallet";
  }
  if (provider.isBraveWallet) {
    return "Brave Wallet";
  }
  if (provider.isTrust || provider.isTrustWallet) {
    return "Trust Wallet";
  }
  // Checked last: wallets that wrap another provider often keep isMetaMask
  // set for compatibility, so a more specific flag is the better signal.
  if (provider.isMetaMask) {
    return "MetaMask";
  }
  return "Injected wallet";
}

async function candidateWallets() {
  const announced = await announcedWalletList();

  // EIP-6963 is authoritative whenever any wallet answers it. Whatever holds
  // window.ethereum is then either one of these wallets or a multiplexer
  // proxying to one, so listing it as well just duplicates an entry - and it
  // can't be deduplicated by object identity, because a proxy is a different
  // object that still reports the wallet's own flags (isMetaMask and friends).
  if (announced.length > 0) {
    return announced;
  }

  // No announcements, so fall back to whatever is injected.
  return legacyWalletList();
}

// The chain a wallet is currently on, or null if it isn't an Ethereum
// wallet at all. Wallets return either a hex string or a number.
async function walletChainId(provider) {
  if (provider == null || typeof provider.request !== "function") {
    return null;
  }

  try {
    const chainId = await provider.request({ method: "eth_chainId" });
    if (chainId == null) {
      return null;
    }
    const parsed = Number(chainId);
    return Number.isNaN(parsed) ? null : parsed;
  } catch (error) {
    console.log(
      "Ignoring provider that cannot answer eth_chainId: " + error.message
    );
    return null;
  }
}

async function hasAuthorizedAccount(provider) {
  try {
    const accounts = await provider.request({ method: "eth_accounts" });
    return Array.isArray(accounts) && accounts.length > 0;
  } catch (error) {
    return false;
  }
}

function requiredChainId() {
  return Number(CosmicWorldsCurrentNetworkID);
}

// Scores a candidate for automatic selection, or returns null if it can't
// talk to Ethereum.
//
// Being on the network the site needs outweighs everything else: the wallet
// that happens to win window.ethereum is often on an unrelated chain, and
// choosing it would mean an unavoidable "wrong network" error even though a
// usable wallet is right there. After that: the wallet last used here, one
// that has already authorized an account, then MetaMask.
async function evaluateWallet(wallet, preferredId) {
  const chainId = await walletChainId(wallet.provider);

  if (chainId === null) {
    return null;
  }

  var score = 0;

  if (chainId === requiredChainId()) {
    score += 8;
  }
  if (preferredId != null && wallet.id === preferredId) {
    score += 4;
  }
  if (await hasAuthorizedAccount(wallet.provider)) {
    score += 2;
  }
  if (wallet.provider.isMetaMask) {
    score += 1;
  }

  return { wallet, chainId, score };
}

function readPreferredWalletId() {
  try {
    return localStorage.getItem(PreferredWalletKey);
  } catch (error) {
    return null;
  }
}

function writePreferredWalletId(id) {
  try {
    if (id == null) {
      // The chosen wallet didn't announce an id, so drop any stale preference
      // rather than probing the old wallet again on every page load.
      localStorage.removeItem(PreferredWalletKey);
    } else {
      localStorage.setItem(PreferredWalletKey, id);
    }
  } catch (error) {
    // Storage can be unavailable (private browsing); the preference is
    // only an optimisation, so carry on without it.
  }
}

export function clearPreferredWallet() {
  selectedWallet = null;
  selectionIsExplicit = false;
  try {
    localStorage.removeItem(PreferredWalletKey);
  } catch (error) {
    // Nothing we can do, and nothing depends on it.
  }
}

/**
 * Returns true if the browser has at least one injected wallet, whether or
 * not it turns out to speak Ethereum.
 */
export async function hasInjectedWallet() {
  const candidates = await candidateWallets();
  return candidates.length > 0;
}

/**
 * Every injected wallet we can see, for presenting a choice. Each entry is
 * { key, id, name, icon, chainId, isUsable, isOnRequiredChain, isSelected }.
 * Wallets that can't answer eth_chainId are reported with isUsable false
 * rather than hidden, so callers can say why one is missing.
 */
export async function listWallets() {
  const candidates = await candidateWallets();
  const wallets = [];

  for (var index = 0; index < candidates.length; index++) {
    const candidate = candidates[index];
    const chainId = await walletChainId(candidate.provider);

    wallets.push({
      key: candidate.id || candidate.name + ":" + index,
      id: candidate.id,
      name: candidate.name,
      icon: candidate.icon,
      chainId,
      isUsable: chainId !== null,
      isOnRequiredChain: chainId === requiredChainId(),
      isSelected:
        selectedWallet != null &&
        selectedWallet.provider === candidate.provider,
    });
  }

  return wallets;
}

/**
 * Picks a specific wallet, by the id or key from listWallets(). This is a
 * deliberate user choice, so it sticks even if the wallet is on the wrong
 * network - they get told to switch rather than silently moved to another
 * wallet.
 */
export async function selectWallet(walletKey) {
  const candidates = await candidateWallets();

  var match = null;
  for (var index = 0; index < candidates.length; index++) {
    const candidate = candidates[index];
    const key = candidate.id || candidate.name + ":" + index;
    if (key === walletKey || candidate.id === walletKey) {
      match = candidate;
      break;
    }
  }

  if (match == null) {
    console.log("No wallet found matching " + walletKey);
    throw Error(Errors.DS_NO_ETH_WALLET);
  }

  console.log("User selected wallet: " + match.name);
  selectedWallet = match;
  selectionIsExplicit = true;
  writePreferredWalletId(match.id);

  return match.provider;
}

/**
 * The chosen EIP-1193 provider. Throws DS_NO_ETH_WALLET when no wallet is
 * installed, or DS_INCOMPATIBLE_ETH_WALLET when none of the installed
 * wallets can talk to Ethereum.
 */
export async function getWalletProvider() {
  if (typeof window === "undefined") {
    throw Error(Errors.DS_NO_ETH_WALLET);
  }

  // Keep the wallet we already have. A wallet the user chose is kept even on
  // the wrong network - that's their call to fix. One we guessed at is
  // re-examined, so switching a wallet to the right chain is picked up
  // without a reload.
  if (selectedWallet != null) {
    const chainId = await walletChainId(selectedWallet.provider);
    if (chainId !== null && (selectionIsExplicit || chainId === requiredChainId())) {
      return selectedWallet.provider;
    }
    selectedWallet = null;
    selectionIsExplicit = false;
  }

  const candidates = await candidateWallets();

  if (candidates.length === 0) {
    console.log("No Ethereum wallet found. Throwing error NO_ETH_WALLET");
    throw Error(Errors.DS_NO_ETH_WALLET);
  }

  const preferredId = readPreferredWalletId();
  const evaluated = [];
  for (const candidate of candidates) {
    const evaluation = await evaluateWallet(candidate, preferredId);
    if (evaluation != null) {
      evaluated.push(evaluation);
    }
  }

  if (evaluated.length === 0) {
    console.log(
      "Found " +
        candidates.length +
        " wallet(s), none of which can talk to Ethereum."
    );
    throw Error(Errors.DS_INCOMPATIBLE_ETH_WALLET);
  }

  evaluated.sort((a, b) => b.score - a.score);

  console.log(
    "Wallets found: " +
      evaluated
        .map((e) => e.wallet.name + " (chain " + e.chainId + ")")
        .join(", ")
  );

  const chosen = evaluated[0];
  console.log(
    "Using wallet: " + chosen.wallet.name + " on chain " + chosen.chainId
  );

  selectedWallet = chosen.wallet;
  writePreferredWalletId(chosen.wallet.id);

  return chosen.wallet.provider;
}

/**
 * Subscribes to a wallet event on the selected provider. Returns a function
 * that removes the listener again, or null if there is no usable wallet.
 */
export async function addWalletListener(eventName, handler) {
  var provider;
  try {
    provider = await getWalletProvider();
  } catch (error) {
    return null;
  }

  if (typeof provider.on !== "function") {
    return null;
  }

  provider.on(eventName, handler);

  return () => {
    if (typeof provider.removeListener === "function") {
      provider.removeListener(eventName, handler);
    }
  };
}
