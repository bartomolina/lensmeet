import { useEffect, useState } from "react";
import Head from "next/head";
import {
  PostFragment,
  useActiveProfile,
  useSearchPublications,
  useApolloClient,
  ProfileFragment,
} from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { getCollectorsQuery } from "../lib/api";
import EventsList from "../components/events-list";

const Events = () => {
  const { data: events, loading } = useSearchPublications({ query: "lensmeet" });
  const [attendance, setAttendance] = useState<Array<IAttendance>>([]);
  const { query } = useApolloClient();

  useEffect(() => {
    if (events) {
      Promise.all(
        events?.map((_event) => {
          return query({
            query: gql(getCollectorsQuery),
            fetchPolicy: "no-cache",
            variables: {
              publicationId: _event.id,
            },
          }).then((response) => {
            return {
              _event: _event.id,
              // @ts-ignore
              attendees: response?.data?.whoCollectedPublication?.items.map((address) => address.defaultProfile),
            };
          });
        })
      ).then((attendance) => setAttendance(attendance));
    }
  }, [events, query]);

  return (
    <>
      <Head>
        <title>LensMeet</title>
        <meta name="description" content="LensMeet" />
      </Head>
      <section>{events && <EventsList events={events as PostFragment[]} attendance={attendance} />}</section>
    </>
  );
};

export default Events;
