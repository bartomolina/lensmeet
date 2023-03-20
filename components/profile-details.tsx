import Image from "next/image";
import { MapPinIcon, GlobeAltIcon, UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import { useFollow } from "@lens-protocol/react-web";
import { useUser } from "../components/user-context";
import { getPictureURL } from "../lib/utils";

const ProfileDetails = ({ profile }) => {
  const { profile: currentUser, authToken } = useUser();
  // const { execute, error, isPending } = useFollow({ profile, profile });

  const getProfileAttribute = (attribute: string) => {
    return profile.attributes.filter((attr) => attr.key === attribute).length
      ? profile.attributes.filter((attr) => attr.key === attribute)[0].value
      : null;
  };
  const attributes = {
    location: getProfileAttribute("location"),
    website: getProfileAttribute("website"),
    twitter: getProfileAttribute("twitter"),
    linkedin: getProfileAttribute("linkedin"),
  };

  return (
    <li className="flex border rounded shadow-sm bg-white px-7 py-4 items-center">
      <div className="w-14 flex-none">
        <Image
          src={getPictureURL(profile)}
          alt={profile.handle}
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
          className="rounded-full"
        />
      </div>
      <div className="w-full ml-7">
        <div className="flex justify-between">
          <div>
            {profile.name && <p className="text-lg font-medium">{profile.name}</p>}
            <p className="-mt-1 text-xs text-lime-700">{profile.handle}</p>
          </div>
          <div className="flex space-x-2 items-center">
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
            {attributes.linkedin && (
              <a href={`https://www.linkedin.com/in/${attributes.linkedin}`} target="_blank" rel="noopener noreferrer">
                <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} />
              </a>
            )}
            {true && (
              <>
                {profile.isFollowedByMe ? (
                  <a
                    href={`https://www.linkedin.com/in/${attributes.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <UserMinusIcon className="h-5 w-5 text-red-700" />
                  </a>
                ) : (
                  <a
                    // onClick={execute}
                    // href={`https://www.linkedin.com/in/${attributes.linkedin}`}
                    // target="_blank"
                    // rel="noopener noreferrer"
                  >
                    <UserPlusIcon className="h-5 w-5 text-lime-700" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
        {profile.bio && <p className="mt-3 text-sm text-gray-600">{profile.bio}</p>}
        {attributes.location && (
          <p className="mt-3 flex items-center text-xs">
            <MapPinIcon className="mr-0.5 h-4 w-4" />
            {attributes.location}
          </p>
        )}
      </div>
    </li>
  );
};

export default ProfileDetails;
