import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { AbiCoder, keccak256 } from "ethers";

import buildCosmicWorld, { getWorldTraits } from "./worldBuilder.js";

// The traits shown before a mint are derived here in JS, while the traits shown
// on /recent are read back out of the minted token's tokenURI. That makes the
// contract the oracle for these tests: WorldBuilder.sol's getTraits is what
// these have to agree with, or the home page promises a world it won't deliver.
//
// Run with: npm test

const TRAIT_KEYS = [
  "seed",
  "planetCount",
  "starDensity",
  "mountainRoughness",
  "waterChoppiness",
  "cloudType",
];

const STAR_TYPES = ["sparse", "distributed", "dense"];
const MOUNTAIN_TYPES = ["soft", "rugged", "rocky"];
const WATER_TYPES = ["calm", "choppy", "rough"];
const CLOUD_TYPES = ["stratus", "stratocumulus", "cumulus"];

// Captured from the deployed contract's tokenURI (mainnet
// 0xFc0d97b66F3A1D9B97d6414c7b3d9431714C7B98). Between them these cover every
// branch of every trait: all three star, mountain, water and cloud values and
// all six planet counts.
const MINTED = [
  { tokenId: 224, seed: 1352180, planetCount: 1, starDensity: "dense",       mountainRoughness: "rugged", waterChoppiness: "rough",  cloudType: "stratocumulus" },
  { tokenId: 223, seed: 4032670, planetCount: 1, starDensity: "dense",       mountainRoughness: "soft",   waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId: 222, seed: 3796279, planetCount: 2, starDensity: "sparse",      mountainRoughness: "soft",   waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId: 221, seed: 4618909, planetCount: 4, starDensity: "sparse",      mountainRoughness: "rugged", waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId: 220, seed: 4149524, planetCount: 3, starDensity: "dense",       mountainRoughness: "rugged", waterChoppiness: "rough",  cloudType: "cumulus" },
  { tokenId: 219, seed: 1652296, planetCount: 1, starDensity: "dense",       mountainRoughness: "soft",   waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId: 218, seed: 4644591, planetCount: 3, starDensity: "sparse",      mountainRoughness: "rugged", waterChoppiness: "rough",  cloudType: "cumulus" },
  { tokenId: 217, seed: 3716645, planetCount: 5, starDensity: "sparse",      mountainRoughness: "rugged", waterChoppiness: "calm",   cloudType: "stratus" },
  { tokenId: 216, seed: 3899259, planetCount: 0, starDensity: "dense",       mountainRoughness: "rugged", waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId: 215, seed: 2841444, planetCount: 3, starDensity: "distributed", mountainRoughness: "soft",   waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId: 214, seed: 1328406, planetCount: 2, starDensity: "sparse",      mountainRoughness: "rocky",  waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId: 213, seed: 2348741, planetCount: 2, starDensity: "dense",       mountainRoughness: "rugged", waterChoppiness: "calm",   cloudType: "stratus" },
  { tokenId:  94, seed: 2845828, planetCount: 1, starDensity: "dense",       mountainRoughness: "rocky",  waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId:  93, seed: 3882282, planetCount: 5, starDensity: "sparse",      mountainRoughness: "rugged", waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId:  92, seed: 1629549, planetCount: 3, starDensity: "distributed", mountainRoughness: "rugged", waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId:  91, seed: 4968837, planetCount: 2, starDensity: "distributed", mountainRoughness: "rugged", waterChoppiness: "rough",  cloudType: "stratocumulus" },
  { tokenId:  90, seed: 4833146, planetCount: 3, starDensity: "distributed", mountainRoughness: "rugged", waterChoppiness: "calm",   cloudType: "stratus" },
  { tokenId:  89, seed: 4364948, planetCount: 1, starDensity: "dense",       mountainRoughness: "rugged", waterChoppiness: "calm",   cloudType: "stratus" },
  { tokenId:  88, seed: 3250033, planetCount: 5, starDensity: "distributed", mountainRoughness: "rugged", waterChoppiness: "rough",  cloudType: "stratocumulus" },
  { tokenId:  87, seed: 4718633, planetCount: 2, starDensity: "distributed", mountainRoughness: "rugged", waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId:  86, seed: 2443000, planetCount: 2, starDensity: "dense",       mountainRoughness: "rugged", waterChoppiness: "rough",  cloudType: "cumulus" },
  { tokenId:  85, seed: 1468141, planetCount: 4, starDensity: "distributed", mountainRoughness: "rocky",  waterChoppiness: "calm",   cloudType: "stratus" },
  { tokenId:  84, seed: 2069161, planetCount: 2, starDensity: "sparse",      mountainRoughness: "rugged", waterChoppiness: "choppy", cloudType: "stratocumulus" },
  { tokenId:  83, seed: 3435765, planetCount: 5, starDensity: "distributed", mountainRoughness: "rugged", waterChoppiness: "choppy", cloudType: "stratocumulus" },
];

// Seeds spread across the contract's uint24 seed space. The stride is fixed so
// a failure is always reproducible.
const SWEEP_SEEDS = Array.from({ length: 400 }, (_, i) => (i * 41947) % 16_777_216);

// Random.randomInt from the contract, written out independently here so the
// band checks below aren't just asking worldBuilder to agree with itself.
function randomIntRef(seed, min, max) {
  if (max <= min) {
    return min;
  }
  const encoded = AbiCoder.defaultAbiCoder().encode(["uint256"], [BigInt(seed)]);
  return Number((BigInt(keccak256(encoded)) % BigInt(max - min + 1)) + BigInt(min));
}

describe("getWorldTraits against the deployed contract", () => {
  test("matches every minted token's on-chain traits", () => {
    for (const minted of MINTED) {
      const derived = getWorldTraits(minted.seed);
      for (const key of TRAIT_KEYS) {
        assert.equal(
          String(derived[key]),
          String(minted[key]),
          `token ${minted.tokenId} (seed ${minted.seed}): ${key} was "${derived[key]}", chain says "${minted[key]}"`
        );
      }
    }
  });

  test("those tokens cover every trait value", () => {
    // Guards the suite itself: if this drops a value, the test above has stopped
    // exercising one of the contract's branches.
    const values = (key) => new Set(MINTED.map((m) => String(m[key])));
    assert.deepEqual([...values("starDensity")].sort(), [...STAR_TYPES].sort());
    assert.deepEqual([...values("mountainRoughness")].sort(), [...MOUNTAIN_TYPES].sort());
    assert.deepEqual([...values("waterChoppiness")].sort(), [...WATER_TYPES].sort());
    assert.deepEqual([...values("cloudType")].sort(), [...CLOUD_TYPES].sort());
    assert.deepEqual([...values("planetCount")].sort(), ["0", "1", "2", "3", "4", "5"]);
  });

  test("matches the metadata cached from the contract in metadata/", () => {
    const dir = path.join(import.meta.dirname, "..", "metadata");
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : [];

    // A dev-time cache, so an empty directory is not a failure - but silently
    // checking nothing would be, hence the count in the message.
    for (const file of files) {
      const cached = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const derived = getWorldTraits(Number(cached.seed));
      for (const key of TRAIT_KEYS) {
        assert.equal(
          String(derived[key]),
          String(cached[key]),
          `metadata/${file} (seed ${cached.seed}): ${key} was "${derived[key]}", cache says "${cached[key]}"`
        );
      }
    }
    console.log(`      checked ${files.length} cached metadata file(s)`);
  });
});

describe("trait classification bands", () => {
  test("star density follows the contract's thresholds", () => {
    for (const seed of SWEEP_SEEDS) {
      const density = randomIntRef(seed, 15, 40);
      const expected = density < 22 ? "sparse" : density > 33 ? "dense" : "distributed";
      assert.equal(getWorldTraits(seed).starDensity, expected, `seed ${seed}, density ${density}`);
    }
  });

  test("mountain roughness follows the contract's thresholds", () => {
    for (const seed of SWEEP_SEEDS) {
      const frequency = randomIntRef(seed, 10, 30);
      const scale = randomIntRef(seed, 1, 3);
      const expected =
        frequency < 20 && scale < 2 ? "soft" : frequency > 20 && scale > 2 ? "rocky" : "rugged";
      assert.equal(
        getWorldTraits(seed).mountainRoughness,
        expected,
        `seed ${seed}, frequency ${frequency}, scale ${scale}`
      );
    }
  });

  test("water choppiness follows the contract's thresholds", () => {
    for (const seed of SWEEP_SEEDS) {
      const choppiness = randomIntRef(seed * 2, 2, 9);
      const expected = choppiness < 4 ? "calm" : choppiness > 6 ? "rough" : "choppy";
      assert.equal(getWorldTraits(seed).waterChoppiness, expected, `seed ${seed}, choppiness ${choppiness}`);
    }
  });

  test("cloud type follows the contract's thresholds", () => {
    for (const seed of SWEEP_SEEDS) {
      const cloud = randomIntRef(seed * 2, 1, 8);
      const expected = cloud < 3 ? "stratus" : cloud > 6 ? "cumulus" : "stratocumulus";
      assert.equal(getWorldTraits(seed).cloudType, expected, `seed ${seed}, cloud ${cloud}`);
    }
  });

  test("planet count follows the contract's percentage bands", () => {
    for (const seed of SWEEP_SEEDS) {
      const percent = randomIntRef(seed * 2, 0, 100);
      const expected =
        percent < 5 ? 0 : percent < 15 ? 1 : percent < 40 ? 2 : percent < 85 ? 3 : percent < 95 ? 4 : 5;
      assert.equal(getWorldTraits(seed).planetCount, expected, `seed ${seed}, percent ${percent}`);
    }
  });

  test("the bands between them are reachable", () => {
    // Nothing above would catch a band that no seed can ever land in.
    const seen = { starDensity: new Set(), mountainRoughness: new Set(), waterChoppiness: new Set(), cloudType: new Set(), planetCount: new Set() };
    for (const seed of SWEEP_SEEDS) {
      const traits = getWorldTraits(seed);
      for (const key of Object.keys(seen)) seen[key].add(traits[key]);
    }
    assert.deepEqual([...seen.starDensity].sort(), [...STAR_TYPES].sort());
    assert.deepEqual([...seen.mountainRoughness].sort(), [...MOUNTAIN_TYPES].sort());
    assert.deepEqual([...seen.waterChoppiness].sort(), [...WATER_TYPES].sort());
    assert.deepEqual([...seen.cloudType].sort(), [...CLOUD_TYPES].sort());
    assert.deepEqual([...seen.planetCount].sort(), [0, 1, 2, 3, 4, 5]);
  });
});

describe("the details describe the artwork beside them", () => {
  test("planet count equals the planets actually drawn", () => {
    // getPlanets emits one <radialGradient id='pgN'> per planet, so the SVG is
    // an independent witness to the number the card claims.
    for (const seed of SWEEP_SEEDS.slice(0, 60)) {
      const svg = decodeURIComponent(buildCosmicWorld(seed).replace("data:image/svg+xml,", ""));
      const drawn = (svg.match(/<radialGradient id='pg\d+'/g) || []).length;
      assert.equal(getWorldTraits(seed).planetCount, drawn, `seed ${seed}`);
    }
  });
});

describe("shape and purity", () => {
  test("returns exactly the keys the trait display reads", () => {
    assert.deepEqual(Object.keys(getWorldTraits(1352180)).sort(), [...TRAIT_KEYS].sort());
  });

  test("supplies every key fetchTokenDetails does, so both feed the same component", () => {
    // WorldTraits is rendered from a minted token's details on /recent and from
    // these traits on the home page. A key renamed on one side only would show
    // up as a blank line rather than an error, so pin it here.
    const source = fs.readFileSync(path.join(import.meta.dirname, "BlockchainAPI.js"), "utf8");
    const returned = source.slice(source.lastIndexOf("return {", source.indexOf("export async function fetchTotalSupply")));
    for (const key of TRAIT_KEYS) {
      assert.ok(
        new RegExp(`\\b${key}\\b`).test(returned),
        `fetchTokenDetails no longer returns "${key}"`
      );
    }
  });

  test("seed is passed through unchanged", () => {
    for (const seed of [0, 1, 1352180, 4_999_999, 16_777_215]) {
      assert.equal(getWorldTraits(seed).seed, seed);
    }
  });

  test("is deterministic and free of side effects", () => {
    for (const seed of SWEEP_SEEDS.slice(0, 40)) {
      assert.deepEqual(getWorldTraits(seed), getWorldTraits(seed), `seed ${seed}`);
    }
  });

  test("values always come from the contract's vocabulary", () => {
    for (const seed of SWEEP_SEEDS) {
      const traits = getWorldTraits(seed);
      assert.ok(STAR_TYPES.includes(traits.starDensity), `seed ${seed}: ${traits.starDensity}`);
      assert.ok(MOUNTAIN_TYPES.includes(traits.mountainRoughness), `seed ${seed}: ${traits.mountainRoughness}`);
      assert.ok(WATER_TYPES.includes(traits.waterChoppiness), `seed ${seed}: ${traits.waterChoppiness}`);
      assert.ok(CLOUD_TYPES.includes(traits.cloudType), `seed ${seed}: ${traits.cloudType}`);
      assert.ok(Number.isInteger(traits.planetCount) && traits.planetCount >= 0 && traits.planetCount <= 5, `seed ${seed}: ${traits.planetCount}`);
    }
  });
});
