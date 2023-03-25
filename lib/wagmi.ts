import { createClient } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { getDefaultClient } from "connectkit";

let prod = true;
if (process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase() === "staging") {
  prod = false;
}

export const wagmiConfig = createClient(
  getDefaultClient({
    appName: "WAGMI",
    alchemyId: prod ? process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API : process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API,
    chains: [prod ? polygon : polygonMumbai],
  })
);
