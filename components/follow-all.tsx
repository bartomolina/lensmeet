import { FormEvent, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ProfileFragment, useActiveProfile, useApolloClient } from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { useNotifications } from "./notifications-context";
import { omit, splitSignature, LensHubContract, LensHubAbi, followAllQuery } from "../lib/api";

type Props = {
  profiles: ProfileFragment[];
};

const FollowAll = ({ profiles }: Props) => {
  const { data: activeProfile } = useActiveProfile();
  const { mutate } = useApolloClient();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const [following, setFollowing] = useState(false);
  const { showNotification, showError } = useNotifications();

  const handleFollowAll = async (event: FormEvent) => {
    event.preventDefault();
    setFollowing(true);

    if (activeProfile) {
      const filteredProfiles = profiles.filter((profile) => {
        // @ts-ignore
        return profile.id != activeProfile.id && !profile.isFollowedByMe && !profile.followModule;
      });

      const profilesToFollow = filteredProfiles.map((profile) => {
        return { profile: profile.id };
      });

      if (!profilesToFollow.length) {
        alert(
          "Already following all the profiles. Some profiles may have a follow module enabled that prevents them to be followed."
        );
        setFollowing(false);
        return;
      }

      if (isConnected) {
        await disconnectAsync();
      }

      const { connector } = await connectAsync();
      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner();

        const typedResult = await mutate({
          mutation: gql(followAllQuery),
          variables: {
            profiles: profilesToFollow,
          },
        });

        // @ts-ignore
        const typedData = typedResult.data.createFollowTypedData.typedData;
        const lensHub = new ethers.Contract(LensHubContract, LensHubAbi, signer);
        const signature = await signer._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename")
        );
        const { v, r, s } = splitSignature(signature);

        const result = await lensHub.followWithSig({
          follower: signer._address,
          profileIds: typedData.value.profileIds,
          datas: typedData.value.datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        });
        showNotification(
          "Follow all in progress",
          "Please click here and wait for the transaction to complete and refresh the page after a few seconds",
          result.hash
        );
      }
    }
  };

  return activeProfile ? (
    <button
      onClick={handleFollowAll}
      disabled={following}
      className={`text-sm border rounded-md px-3 py-1 bg-opacity-20 ${
        following
          ? "border-gray-500 text-gray-900 bg-gray-100"
          : "border-lime-500 text-lime-900 bg-lime-50 hover:bg-lime-100"
      }`}
    >
      Follow all
    </button>
  ) : (
    <></>
  );
};

export default FollowAll;
