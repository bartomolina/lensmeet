import Image from "next/image";
import { MapPinIcon, GlobeAltIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useProfile, useActiveProfile } from "@lens-protocol/react-web";
import { getPictureURL } from "../lib/utils";
import FollowButton from "./follow-button";

type Props = {
  id: string;
  isOwner: boolean;
};

const ProfileDetails = ({ id, isOwner }: Props) => {
  const { data: activeProfile } = useActiveProfile();
  const { data: profile, loading } = useProfile({ profileId: id });

  let attributes = {
    location: "",
    website: "",
    twitter: "",
    instagram: "",
    github: "",
    linkedin: "",
  };
  if (profile && !loading) {
    const getProfileAttribute = (attribute: string) => {
      // @ts-ignore
      return profile.attributes[attribute] ? profile.attributes[attribute].attribute.value : null;
    };
    attributes = {
      location: getProfileAttribute("location") ?? "",
      website: getProfileAttribute("website") ?? "",
      twitter: getProfileAttribute("twitter") ?? "",
      instagram: getProfileAttribute("instagram") ?? "",
      github: getProfileAttribute("github") ?? "",
      linkedin: getProfileAttribute("linkedin") ?? "",
    };
  }

  return (
    <>
      {profile && !loading && (
        <li
          className={`${
            isOwner ? "bg-lime-50 bg-opacity-50" : "bg-white"
          } border rounded shadow-sm divide-y hover:-translate-y-0.5 transform transition`}
        >
          <a
            href={`https://lenster.xyz/u/${profile.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-6 py-4"
          >
            <div className="w-14 h-14 relative flex-none">
              <Image
                src={getPictureURL(profile)}
                alt={profile.handle}
                fill
                sizes="(max-width: 56px) 100vw"
                className="object-cover rounded-full"
              />
            </div>
            <div className="w-full ml-7">
              <div className="flex justify-between">
                <div>
                  {profile.name && <p className="text-lg font-medium">{profile.name}</p>}
                  <p className="-mt-1 text-xs text-lime-700">{profile.handle}</p>
                </div>
                {isOwner && <div className="text-sm font-medium text-end text-lime-900">Owner</div>}
              </div>
              {profile.bio && <p className="mt-3 text-gray-800">{profile.bio}</p>}
              {attributes.location && (
                <p className="mt-3 flex items-center text-xs text-gray-500">
                  <MapPinIcon className="mr-0.5 h-4 w-4" />
                  {attributes.location}
                </p>
              )}
            </div>
          </a>

          <div className="flex justify-between py-3 px-6 text-gray-600">
            <div className="flex items-center text-sm space-x-2">
              <PencilSquareIcon className="h-4 w-4" />
              <span>{profile.stats.totalPublications}</span>
            </div>
            <div className="flex items-center space-x-5">
              <div className="flex space-x-2.5">
                {attributes.website && (
                  <a href={attributes.website} target="_blank" rel="noopener noreferrer">
                    <GlobeAltIcon className="h-5 w-5" />
                  </a>
                )}
                {attributes.twitter && (
                  <a href={`https://twitter.com/${attributes.twitter}`} target="_blank" rel="noopener noreferrer">
                    <Image src="/twitter.svg" alt="Twitter" width={20} height={20} />
                  </a>
                )}
                {attributes.instagram && (
                  <a href={`https://instagram.com/${attributes.twitter}`} target="_blank" rel="noopener noreferrer">
                    <Image src="/instagram.svg" alt="Instagram" width={20} height={20} />
                  </a>
                )}
                {attributes.github && (
                  <a href={`https://github.com/${attributes.twitter}`} target="_blank" rel="noopener noreferrer">
                    <Image src="/github.svg" alt="GitHub" width={20} height={20} />
                  </a>
                )}
                {attributes.linkedin && (
                  <a
                    href={`https://www.linkedin.com/in/${attributes.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} />
                  </a>
                )}
              </div>
              {activeProfile && <FollowButton follower={activeProfile} followee={profile} />}
            </div>
          </div>
        </li>
      )}
    </>
  );
};

export default ProfileDetails;
