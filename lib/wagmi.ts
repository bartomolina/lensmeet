import { createClient } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { getDefaultClient } from "connectkit";
import { isProd } from "./utils";

export const wagmiConfig = createClient(
  getDefaultClient({
    appName: "WAGMI",
    alchemyId: isProd ? process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API : process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API,
    chains: [isProd ? polygon : polygonMumbai],
  })
);
