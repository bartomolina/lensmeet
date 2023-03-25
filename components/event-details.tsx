import Image from "next/image";
import { MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import { PostFragment } from "@lens-protocol/react-web";
import CollectButton from "./collect-button";

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

type Props = {
  _event: PostFragment;
};

const EventDetails = ({ _event }: Props) => {
  const getProfileAttribute = (attribute: string) => {
    // @ts-ignore
    return _event.metadata?.attributes.find((attr) => attr.traitType === attribute)
      ? _event.metadata?.attributes.find((attr) => attr.traitType === attribute)?.value
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
          href={`https://testnet.lenster.xyz/posts/${_event.id}`}
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
                <p className="text-lg font-medium">{_event.metadata.name}</p>
                <p className="-mt-1 text-xs text-lime-700">{attributes.organizer}</p>
              </div>
              {attributes.startDate && <div className="text-gray-400">{dateRange}</div>}
            </div>
            <p className="mt-3 text-gray-600">{_event.metadata.content}</p>
            <p className="mt-3 flex items-center text-xs">
              <MapPinIcon className="mr-0.5 h-4 w-4" />
              {attributes.location}
            </p>
          </div>
        </a>
        <div className="flex justify-between items-center space-x-5 py-3 px-4 text-gray-600">
          <div className="flex items-center">
            <div className="isolate flex -space-x-2 overflow-hidden">
              <img
                className="relative z-30 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <img
                className="relative z-20 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <img
                className="relative z-10 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                alt=""
              />
              <img
                className="relative z-0 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <span className="text-sm ml-3 italic">
              <strong>3</strong> attending
            </span>
          </div>
          <div className="flex">
            <CollectButton publication={_event} />
          </div>
        </div>
      </li>
    </>
  );
};

export default EventDetails;
