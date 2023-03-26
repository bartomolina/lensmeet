import { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  ProfileOwnedByMeFragment,
  useActiveProfile,
  useApolloClient,
  useCollect,
  AnyPublicationFragment,
} from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { useNotifications } from "./notifications-context";
import { omit, splitSignature, LensHubContract, LensHubAbi, collectQuery } from "../lib/api";

type Props = {
  publication: AnyPublicationFragment;
};

const CollectButton = ({ publication }: Props) => {
  const { data: activeProfile, loading } = useActiveProfile();
  const { execute: collect, isPending } = useCollect({
    collector: activeProfile as ProfileOwnedByMeFragment,
    publication,
  });
  const { showNotification, showError } = useNotifications();
  const { mutate } = useApolloClient();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const [collecting, setCollecting] = useState(false);

  const handleCollect = async (event: FormEvent) => {
    event.preventDefault();
    console.log(publication);
    collect().catch(console.log);
  };

  const handleCollectAPI = async (event: FormEvent) => {
    event.preventDefault();
    setCollecting(true);

    if (activeProfile) {
      if (isConnected) {
        await disconnectAsync();
      }

      const { connector } = await connectAsync();
      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner();

        const typedResult = await mutate({
          mutation: gql(collectQuery),
          variables: {
            publicationId: publication.id,
          },
        });

        // @ts-ignore
        const typedData = typedResult.data.createCollectTypedData.typedData;
        const lensHub = new ethers.Contract(LensHubContract, LensHubAbi, signer);
        const signature = await signer._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename")
        );
        const { v, r, s } = splitSignature(signature);
        const sig = {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        };

        const result = await lensHub.collectWithSig({
          collector: signer._address,
          profileId: typedData.value.profileId,
          pubId: typedData.value.pubId,
          data: typedData.value.data,
          sig,
        });

        showNotification(
          `Collecting post in progress`,
          "Please click here and wait for the transaction to complete and refresh the page after a few seconds",
          result.hash
        );
      }
    }
  };

  return (
    <>
      <button
        onClick={handleCollectAPI}
        disabled={collecting}
        className={`border rounded-md px-3 py-1 bg-opacity-20 ${
          collecting
            ? "border-gray-500 text-gray-900 bg-gray-100"
            : "border-lime-500 text-lime-900 bg-lime-50 hover:bg-lime-100"
        }`}
      >
        I&apos;m going
      </button>
    </>
  );
};

export default CollectButton;
