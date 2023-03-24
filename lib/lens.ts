import { LensConfig, production, staging } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

let prod = true;
if (process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase() === "staging") {
  prod = false;
}

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: prod ? production : staging,
};

export default lensConfig;
