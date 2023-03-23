import { createClient } from "wagmi";
import { polygon } from "wagmi/chains";
import { getDefaultClient } from "connectkit";

const wagmiConfig = createClient(
  getDefaultClient({
    appName: "WAGMI",
    alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API,
    chains: [polygon],
  })
);

export default wagmiConfig;
