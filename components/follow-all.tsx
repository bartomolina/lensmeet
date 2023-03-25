import { FormEvent } from "react";
import { ethers, utils } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useActiveProfile, useApolloClient } from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
// @ts-ignore
import omitDeep from "omit-deep";
import { followAll } from "../lib/api";
import LensHubAbi from "../lib/contracts/lens-hub-contract-abi.json";

const LensHubContract = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

const FollowAll = () => {
  const { data: activeProfile } = useActiveProfile();
  const { mutate } = useApolloClient();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();

  const handleFollowAll = async (event: FormEvent) => {
    event.preventDefault();

    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();
    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();

      const typedResult = await mutate({
        mutation: gql(followAll),
      });

      // @ts-ignore
      const typedData = typedResult.data.createFollowTypedData.typedData;
      const lensHub = new ethers.Contract(LensHubContract, LensHubAbi, signer);
      const signature = await await signer._signTypedData(
        omit(typedData.domain, "__typename"),
        omit(typedData.types, "__typename"),
        omit(typedData.value, "__typename")
      );
      const { v, r, s } = splitSignature(signature);

      await lensHub.followWithSig({
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
    }
  };

  return activeProfile ? (
    <button
      onClick={handleFollowAll}
      className="border rounded-md px-3 py-1 text-white text-sm bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br"
    >
      Follow all
    </button>
  ) : (
    <></>
  );
};

export default FollowAll;
