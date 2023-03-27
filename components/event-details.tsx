import { IEvent } from "../global";
import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { PostFragment, ProfileFragment, useActiveProfile } from "@lens-protocol/react-web";
import CollectButton from "./collect-button";
import { getPictureURL } from "../lib/utils";
import { isProd } from "../lib/utils";

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

type Props = {
  _event: IEvent;
};

const EventDetails = ({ _event }: Props) => {
  const { data: activeProfile, loading } = useActiveProfile();
  const getProfileAttribute = (attribute: string) => {
    // @ts-ignore
    return _event._event.metadata?.attributes.find((attr) => attr.traitType === attribute)
      ? _event._event.metadata?.attributes.find((attr) => attr.traitType === attribute)?.value
      : null;
  };
  const attributes = {
    location: getProfileAttribute("Location") ?? "",
    country: getProfileAttribute("Country") ?? "",
    organizer: getProfileAttribute("Organizer") ?? "",
    startDate: getProfileAttribute("Start date")
      ? new Date(parseInt(getProfileAttribute("Start date") as string) * 1000)
      : null,
    endDate: getProfileAttribute("End date")
      ? new Date(parseInt(getProfileAttribute("End date") as string) * 1000)
      : null,
  };

  let dateRange = "";
  if (attributes.startDate && attributes.endDate) {
    dateRange = `${monthNames[attributes.startDate.getMonth()]} ${attributes.startDate.getDate()} - ${
      monthNames[attributes.endDate.getMonth()]
    } ${attributes.endDate.getDate()}`;
  }

  return (
    <>
      <li className="border rounded shadow-sm bg-white divide-y hover:-translate-y-0.5 transform transition">
        <a
          href={`${isProd ? "https://lenster.xyz/posts/" : "https://testnet.lenster.xyz/posts/"}${_event._event.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-7 py-4"
        >
          <div className="w-14 h-14 relative flex-none">
            {attributes.country && (
              <Image
                src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/${attributes.country?.toLowerCase()}.svg`}
                alt={attributes.country}
                fill
                sizes="(max-width: 56px) 100vw"
                className="object-cover rounded-full"
              />
            )}
          </div>
          <div className="w-full ml-7">
            <div className="flex justify-between">
              <div className="items-center">
                <p className="text-lg font-medium">{_event._event.metadata.name}</p>
                <p className="-mt-1 text-xs text-lime-700">{attributes.organizer}</p>
              </div>
              {attributes.startDate && <div className="text-gray-400">{dateRange}</div>}
            </div>
            <p className="mt-3 text-gray-600">{_event._event.metadata.content}</p>
            <p className="mt-3 flex items-center text-xs">
              <MapPinIcon className="mr-0.5 h-4 w-4" />
              {attributes.location}
            </p>
          </div>
        </a>
        {(_event.attendees.length > 0 || activeProfile) && (
          <div className="flex justify-between items-center space-x-5 py-3 px-6 text-gray-600">
            <div className="flex items-center">
              {_event.attendees.length > 0 && (
                <>
                  <div className="isolate flex -space-x-2 overflow-hidden">
                    {_event.attendees.map((attendee) => (
                      <div key={attendee.id} className="w-8 h-8 relative flex-none">
                        <Image
                          src={getPictureURL(attendee)}
                          alt={attendee.handle}
                          fill
                          sizes="(max-width: 32px) 100vw"
                          className="object-cover rounded-full ring-2 ring-white z-30"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm ml-3 italic">
                    <strong>{_event.attendees.length}</strong> attending
                  </span>
                </>
              )}
            </div>
            <div className="flex">
              <CollectButton _event={_event} />
            </div>
          </div>
        )}
      </li>
    </>
  );
};

export default EventDetails;
