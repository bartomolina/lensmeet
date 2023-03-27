import { IEvent } from "../global";
import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { useSearchPublications, useApolloClient } from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { getCollectorsQuery } from "../lib/api";

const EventsContext = createContext({
  events: [] as IEvent[],
});

export const useEvents = () => useContext(EventsContext);

export const EventsProvider = ({ children }: React.PropsWithChildren) => {
  const { data } = useSearchPublications({ query: "lensmeet" });
  const { query } = useApolloClient();
  const [events, setEvents] = useState<Array<IEvent>>([]);

  useEffect(() => {
    if (data) {
      Promise.all(
        data?.map((_event) => {
          return query({
            query: gql(getCollectorsQuery),
            fetchPolicy: "no-cache",
            variables: {
              publicationId: _event.id,
            },
          }).then((response) => {
            return {
              _event: _event,
              // @ts-ignore
              attendees: response?.data?.whoCollectedPublication?.items.map((address) => address.defaultProfile),
            };
          });
        })
      ).then((events) => {
        events.sort((a, b) => {
          let aDate = 0;
          let bDate = 0;
      
          let aStartAttr = a._event.metadata.attributes.find(attribute => attribute.traitType === "Start date" );
          let bStartAttr = b._event.metadata.attributes.find(attribute => attribute.traitType === "Start date" );
          if (aStartAttr && bStartAttr) {
            aDate = aStartAttr.value ? parseInt(aStartAttr.value) : 0;
            bDate = bStartAttr.value ? parseInt(bStartAttr.value) : 0;
          }
          return aDate - bDate;
        });

        setEvents(events)
      });
    }
  }, [data, query]);

  return <EventsContext.Provider value={{ events }}>{children}</EventsContext.Provider>;
};
