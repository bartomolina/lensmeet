import { utils } from "ethers";
// @ts-ignore
import omitDeep from "omit-deep";
import { isProd } from "./utils";
import _LensHubAbi from "./contracts/lens-hub-contract-abi.json";
import _LensPeripheryAbi from "./contracts/lens-periphery-data-provider.json";

const getMembersQueryType = isProd ? "ProfileId" : "Handle";
const getMembersVariable = isProd ? "profileIds" : "handles";

export const LensHubContract = isProd
  ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
  : "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";

export const LensPeripheryContract = isProd
  ? "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f"
  : "0xD5037d72877808cdE7F669563e9389930AF404E8";

export const LensHubAbi = _LensHubAbi;
export const LensPeripheryAbi = _LensPeripheryAbi;

export const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const getMembers = `
query Profiles($profiles: [${getMembersQueryType}!]) {
  profiles(request: { ${getMembersVariable}: $profiles, limit: 10 }) {
    items {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
      onChainIdentity {
        proofOfHumanity
        ens {
          name
        }
        sybilDotOrg {
          verified
          source {
            twitter {
              handle
            }
          }
        }
        worldcoin {
          isHuman
        }
      }
      interests
      isFollowedByMe
      isFollowing
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`;

export const followAll = `
mutation CreateFollowTypedData($profiles: [Follow!]!) {
  createFollowTypedData(request:{
    follow: $profiles
  }) {
    id
    expiresAt
    typedData {
      domain {
        name
        chainId
        version
        verifyingContract
      }
      types {
        FollowWithSig {
          name
          type
        }
      }
      value {
        nonce
        deadline
        profileIds
        datas
      }
    }
  }
}
`;

export const updateProfile = `
mutation CreateSetProfileMetadataTypedData($profileId: ProfileId!, $url: Url!) {
  createSetProfileMetadataTypedData(request: { 
      profileId: $profileId, 
      metadata: $url 
  }) {
    id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          metadata
        }
      }
  }
}
`;
