import { LensConfig, production, staging } from "@lens-protocol/react-web";
import { FailedTransactionError } from "@lens-protocol/react/dist/declarations/src/transactions/adapters/TransactionQueuePresenter";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

let prod = true;
if (process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase() === "staging") {
  prod = false;
}

export const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: prod ? production : staging,
};
