import { PostFragment } from "@lens-protocol/react";
import EventDetails from "./event-details";

type Props = {
  events: PostFragment[];
};

const ProfilesList = ({ events }: Props) => (
  <ul className="space-y-4">
    {events && events.map((_event) => <EventDetails key={_event.id} _event={_event} />)}
  </ul>
);

export default ProfilesList;
