import { PostFragment, useActiveProfile, useSearchPublications } from "@lens-protocol/react-web";
import Head from "next/head";
import EventsList from "../components/events-list";

const Events = () => {
  const { data: events, loading } = useSearchPublications({ query: "lensmeet" });

  return (
    <>
      <Head>
        <title>LensMeet</title>
        <meta name="description" content="LensMeet" />
      </Head>
      <section>{events && <EventsList events={events as PostFragment[]} />}</section>
    </>
  );
};

export default Events;
