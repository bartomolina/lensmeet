import { utils } from "ethers";
// @ts-ignore
import omitDeep from "omit-deep";
import { isProd } from "./utils";
import _LensHubAbi from "./contracts/lens-hub-contract-abi.json";
import _LensPeripheryAbi from "./contracts/lens-periphery-data-provider.json";
import _LensFollowAbi from "./contracts/lens-follow-nft-contract-abi.json";

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
export const LensFollowAbi = _LensFollowAbi;

export const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const getMembersQuery = `
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

export const getCollectorsQuery = `
query WhoCollectedPublication($publicationId: InternalPublicationId!) {
  whoCollectedPublication(request: { publicationId: $publicationId }) {
    items {
      address
      defaultProfile {
        id
        name
        bio
        isDefault
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
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
            contractAddress
            amount {
              asset {
                name
                symbol
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
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`;

export const followAllQuery = `
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

export const followQuery = `
mutation CreateFollowTypedData($profile: ProfileId!) {
  createFollowTypedData(request:{
    follow: [
      {
        profile: $profile
      }
    ]
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

export const unfollowQuery = `
mutation CreateUnfollowTypedData($profile: ProfileId!) {
  createUnfollowTypedData(request:{
    profile: $profile
  }) {
    id
    expiresAt
    typedData {
      types {
        BurnWithSig {
          name
          type
        }
      }
      domain {
        version
        chainId
        name
        verifyingContract
      }
      value {
        nonce
        deadline
        tokenId
      }
    }
  }
}
`;

export const updateProfileQuery = `
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

export const createPostQuery = `
mutation CreatePostTypedData($profileId: ProfileId!, $url: Url!) {
  createPostTypedData(request: {
    profileId: $profileId,
    contentURI: $url,
    collectModule: {
      freeCollectModule: {
        followerOnly: false
      }
    },
    referenceModule: {
      followerOnlyReferenceModule: false
    }
  }) {
    id
    expiresAt
    typedData {
      types {
        PostWithSig {
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
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
  }
}
`

export const collectQuery = `
mutation CreateCollectTypedData($publicationId: InternalPublicationId!) {
  createCollectTypedData(request: {
    publicationId: $publicationId
  }) {
    id
    expiresAt
    typedData {
      types {
        CollectWithSig {
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
        pubId
        data
      }
    }
  }
}
`
