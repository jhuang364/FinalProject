//Manages assets such as images needed for the game

const ASSET_NAMES = [
  'Coin.svg',
  'Miner.svg',
  'Pick.svg',
  'Tent.svg',
];

const assets = {};

//Passes only when all assets are downloaded successfully
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];
