import { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  useFollow,
  useUnfollow,
  ProfileFragment,
  ProfileOwnedByMeFragment,
  useActiveProfile,
  useApolloClient,
} from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import { useNotifications } from "./notifications-context";
import {
  omit,
  splitSignature,
  LensHubContract,
  LensHubAbi,
  LensFollowAbi,
  followQuery,
  unfollowQuery,
} from "../lib/api";

type Props = {
  follower: ProfileOwnedByMeFragment;
  followee: ProfileFragment;
};

const FollowButton = ({ follower, followee }: Props) => {
  const { execute: follow, isPending: isFollowPending, error: followError } = useFollow({ follower, followee });
  const { execute: unfollow, isPending: isUnfollowPending, error: unfollowError } = useUnfollow({ follower, followee });
  const { showNotification, showError } = useNotifications();
  const { data: activeProfile } = useActiveProfile();
  const { mutate } = useApolloClient();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (followee.handle && showError) {
      if (followError) {
        showError(`Error following ${followee.handle}`, followError.message);
      }
      if (unfollowError) {
        showError(`Error unfollowing ${followee.handle}`, unfollowError.message);
      }
    }
  }, [followError, unfollowError, followee.handle, showError]);

  const handleFollow = (event: FormEvent, action: () => Promise<any>, message: string) => {
    event.preventDefault();
    action()
      .then((result) => {
        if (!result.error) {
          showNotification(`${message} done`, `You're now ${message.toLowerCase()} ${followee.handle}`);
        }
      })
      .catch((error) => {
        showError("Error", error.message);
      });
  };

  const handleFollowAPI = async (event: FormEvent, action: "follow" | "unfollow") => {
    const query = action === "follow" ? followQuery : unfollowQuery;
    const message = action === "follow" ? "Following" : "Unfollowing";

    event.preventDefault();
    setFollowing(true);

    if (activeProfile) {
      if (isConnected) {
        await disconnectAsync();
      }

      const { connector } = await connectAsync();
      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner();

        const typedResult = await mutate({
          mutation: gql(query),
          variables: {
            profile: followee.id,
          },
        });

        // @ts-ignore
        const typedData =
          action === "follow"
            ? // @ts-ignore
              typedResult.data.createFollowTypedData.typedData
            : // @ts-ignore
              typedResult.data.createUnfollowTypedData.typedData;
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

        let result;

        if (action === "follow") {
          result = await lensHub.followWithSig({
            follower: signer._address,
            profileIds: typedData.value.profileIds,
            datas: typedData.value.datas,
            sig,
          });
        } else {
          const followNftContract = new ethers.Contract(typedData.domain.verifyingContract, LensFollowAbi, signer);
          result = await followNftContract.burnWithSig(typedData.value.tokenId, sig);
        }

        showNotification(
          `${message} ${followee.handle} in progress`,
          "Please click here and wait for the transaction to complete and refresh the page after a few seconds",
          result.hash
        );
      }
    }
  };

  return (
    <>
      {followee.id != follower?.id && (
        <>
          {followee.followStatus && followee.followStatus.isFollowedByMe ? (
            <button
              onClick={(e) => handleFollowAPI(e, "unfollow")}
              disabled={isUnfollowPending || following || followee.__followModule != null}
              className={`border rounded-md px-3 py-1 bg-opacity-20 ${
                isUnfollowPending || following || followee.__followModule != null
                  ? "border-gray-500 text-gray-900 bg-gray-100"
                  : "border-red-500 text-red-900 bg-red-50 hover:bg-red-100"
              }`}
            >
              <UserMinusIcon
                className={`h-4 w-4 ${
                  isUnfollowPending || following || followee.__followModule != null ? "text-gray-500" : "text-red-500"
                }`}
              />
            </button>
          ) : (
            <button
              onClick={(e) => handleFollowAPI(e, "follow")}
              disabled={isFollowPending || following || followee.__followModule != null}
              className={`border rounded-md px-3 py-1 bg-opacity-20 ${
                isFollowPending || following || followee.__followModule != null
                  ? "border-gray-500 text-gray-900 bg-gray-100"
                  : "border-lime-500 text-lime-900 bg-lime-50 hover:bg-lime-100"
              }`}
            >
              <UserPlusIcon
                className={`h-4 w-4 ${
                  isFollowPending || following || followee.__followModule != null ? "text-gray-500" : "text-lime-500"
                }`}
              />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default FollowButton;
