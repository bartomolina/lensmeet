import { LensConfig, production, staging } from "@lens-protocol/react-web";
import { FailedTransactionError } from "@lens-protocol/react/dist/declarations/src/transactions/adapters/TransactionQueuePresenter";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { isProd } from "./utils";

export const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: isProd ? production : staging,
};
