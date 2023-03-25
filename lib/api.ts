import { isProd } from "./utils";

const getMembersQueryType = isProd ? "ProfileId" : "Handle";
const getMembersVariable = isProd ? "profileIds" : "handles";

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
`