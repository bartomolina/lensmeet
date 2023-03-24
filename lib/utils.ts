// @ts-nocheck
import { ProfileFragment } from "@lens-protocol/react";
import { WebBundlr } from "@bundlr-network/client";
import { fetchSigner } from "wagmi/actions";

export const getPictureURL = (profile: ProfileFragment) => {
  let picture = "/lens.jpeg";
  if (profile.picture) {
    if (profile.picture.original && profile.picture.original.url) {
      if (profile.picture.original.url.startsWith("ipfs://")) {
        const result = profile.picture.original.url.substring(7, profile.picture.original.url.length);
        picture = `https://lens.infura-ipfs.io/ipfs/${result}`;
      } else {
        picture = profile.picture.original.url;
      }
    } else if (profile.picture.uri) {
      picture = profile.picture.uri;
    }
  }

  return picture;
};

const TOP_UP = "200000000000000000"; // 0.2 MATIC
const MIN_FUNDS = 0.05;

export const upload = async (data: any) => {
  const signer = await fetchSigner();
  const provider = signer?.provider;
  // use method injection to add the missing function
  provider.getSigner = () => signer;
  // create a WebBundlr object
  // const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider);
  const bundlr = new WebBundlr('https://devnet.bundlr.network', 'matic', signer?.provider, {
    providerUrl: 'https://rpc-mumbai.maticvigil.com/',
  });

  await bundlr.ready();

  const address = await signer?.getAddress();
  let url = "";
  if (address) {
    const balance = await bundlr.getBalance(address);

    if (bundlr.utils.unitConverter(balance).toNumber() < MIN_FUNDS) {
      await bundlr.fund(TOP_UP);
    }

    const serialized = JSON.stringify(data);
    const tx = await bundlr.upload(serialized, {
      tags: [{ name: "Content-Type", value: "application/json" }],
    });

    url = `https://arweave.net/${tx.id}`;
    console.log(`Upload success content URI=${url}`);
  }
  return url;
};
