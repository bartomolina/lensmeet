import { IEvent } from "../global";
import Image from "next/image";
import Link from "next/link";
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
    dateRange = `${attributes.startDate.getDate()} - ${attributes.endDate.getDate()}`;
  }

  return (
    <>
      <li className="border rounded shadow-sm bg-white divide-y hover:-translate-y-0.5 transform transition">
        <Link href={`/event/${_event._event.id}`} className="flex items-center px-2 py-2 space-x-6">
          <div className="w-16 h-10 relative flex-none">
            {attributes.country && (
              <Image
                src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/${attributes.country?.toLowerCase()}.svg`}
                alt={attributes.country}
                fill
                sizes="(max-width: 64px) 100vw"
                className="object-cover border"
              />
            )}
          </div>
          <div className="flex justify-between w-full ml-7 space-x-4">
            <div className="flex w-full">
              <div className="w-1/3">
                <p className="text-lg font-medium">{_event._event.metadata.name}</p>
                <p className="-mt-1 text-xs text-lime-700">{attributes.organizer}</p>
              </div>
              {attributes.startDate && (
                <div className="w-1/3 flex items-center font-light text-2xl text-gray-400 whitespace-nowrap">
                  {dateRange}
                </div>
              )}
              <p className="w-1/3 flex items-center">
                <MapPinIcon className="mr-0.5 h-4 w-4" />
                {attributes.location}
              </p>
            </div>
            <div className="flex items-center w-28">
              {(_event.attendees.length > 0 || activeProfile) && _event.attendees.length > 0 && (
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
                </>
              )}
              <div className="flex">
                <CollectButton _event={_event} />
              </div>
            </div>
          </div>
        </Link>
      </li>
    </>
  );
};

export default EventDetails;
