import Head from "next/head";
import { useEvents } from "../components/events-context";
import EventsList from "../components/events-list";

const Events = () => {
  const { events } = useEvents();

  return (
    <>
      <Head>
        <title>LensMeet</title>
        <meta name="description" content="LensMeet" />
      </Head>
      <section>{events && <EventsList events={events} />}</section>
    </>
  );
};

export default Events;
