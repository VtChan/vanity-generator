import { ethers } from "ethers";

self.onmessage = function (e) {
  const { prefix, suffix, threadId, totalThreads } = e.data;

  let attempts = 0

  while (true) {
    const newWallet = ethers.Wallet.createRandom();
    const address = newWallet.address.toLowerCase();
    attempts++;

    const matchesPrefix = prefix ? address.startsWith(`0x${prefix.toLowerCase()}`) : true;
    const matchesSuffix = suffix ? address.endsWith(suffix.toLowerCase()) : true;

    if (matchesPrefix && matchesSuffix) {
      // console.log("address:"+newWallet.address+", privKey:"+newWallet.privateKey)
      self.postMessage({ wallet: newWallet, attempts, threadId });
      break;
    }
  }
};
