import Image from "next/image";
import { MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import { useProfile, useActiveProfile, PostFragment } from "@lens-protocol/react-web";
import { getPictureURL } from "../lib/utils";
import FollowButton from "./follow-button";

type Props = {
  _event: PostFragment;
};

const EventDetails = ({ _event }: Props) => {
  const { data: activeProfile } = useActiveProfile();

  const getProfileAttribute = (attribute: string) => {
    // @ts-ignore
    return _event.metadata?.attributes.find((attr) => attr.traitType === attribute)
      ? _event.metadata?.attributes.find((attr) => attr.traitType === attribute)?.value
      : "";
  };
  const attributes = {
    location: getProfileAttribute("Location") ?? "",
    country: getProfileAttribute("Country") ?? "",
    organizer: getProfileAttribute("Organizer") ?? "",
    startDate: getProfileAttribute("Start date") ?? "",
    endDate: getProfileAttribute("End date") ?? "",
  };

  console.log(_event);
  console.log(attributes);

  return (
    <>
      <li className="border rounded shadow-sm bg-white divide-y hover:-translate-y-0.5 transform transition">
        <a
          href={`https://testnet.lenster.xyz/posts/${_event.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-7 py-4"
        >
          <div className="w-14 flex-none">
            <Image
              src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/${attributes.country?.toLowerCase()}.svg`}
              alt={attributes.country}
              width={50}
              height={50}
              style={{ width: "auto", height: "auto" }}
              className="rounded-full"
            />
          </div>
          <div className="w-full ml-7">
            <div className="items-center">
              <p className="text-lg font-medium">{_event.metadata.name}</p>
              <p className="-mt-1 text-xs text-lime-700">{attributes.organizer}</p>
            </div>
            <p className="mt-3 text-gray-600">{_event.metadata.description}</p>
            <p className="mt-3 flex items-center text-xs">
              <MapPinIcon className="mr-0.5 h-4 w-4" />
              {attributes.location}
            </p>
          </div>
        </a>
      </li>
      {/* {profile && !loading && (
        <li className="border rounded shadow-sm bg-white divide-y hover:-translate-y-0.5 transform transition">
          <a
            href={`https://lenster.xyz/u/${profile.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-7 py-4"
          >
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
              <div className="items-center">
                {profile.name && <p className="text-lg font-medium">{profile.name}</p>}
                <p className="-mt-1 text-xs text-lime-700">{profile.handle}</p>
              </div>
              {profile.bio && <p className="mt-3 text-gray-600">{profile.bio}</p>}
              {attributes.location && (
                <p className="mt-3 flex items-center text-xs">
                  <MapPinIcon className="mr-0.5 h-4 w-4" />
                  {attributes.location}
                </p>
              )}
            </div>
          </a>
          {(attributes.website ||
            attributes.twitter ||
            attributes.instagram ||
            attributes.github ||
            attributes.linkedin ||
            activeProfile) && (
            <div className="flex justify-end items-center space-x-5 py-3 pr-4 text-gray-600">
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
              {activeProfile && <FollowButton profile={profile} from={activeProfile} />}
            </div>
          )}
        </li>
      )} */}
    </>
  );
};

export default EventDetails;
