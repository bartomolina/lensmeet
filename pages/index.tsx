import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import axios from "axios";
import { useActiveProfile, useApolloClient } from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { getMembers } from "../lib/api";
import ProfilesList from "../components/profiles-list";
import FollowAll from "../components/follow-all";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Home = () => {
  const { data } = useSWR("/lenslists/lists/845068988534030337/members", fetcher);
  const { data: activeProfile } = useActiveProfile();
  const { query } = useApolloClient();
  const [profiles, setProfiles] = useState([]);

  const lensListsProfiles = useMemo(() => {
    return data?.data.members.items.map((p) => p.profileId);
  }, [data]);

  useEffect(() => {
    if (lensListsProfiles) {
      query({
        query: gql(getMembers),
        fetchPolicy: "no-cache",
        variables: {
          profiles: lensListsProfiles,
        },
      }).then((response) => {
        let members = response?.data?.profiles?.items;
        members = [...members].sort((a, b) => b.stats.totalPublications - a.stats.totalPublications);
        console.log(members);

        console.log(members.filter((m) => !m.isFollowedByMe && !m.followModule).length);
        console.log(members.filter((m) => !m.isFollowedByMe && !m.followModule)[1].id);
        console.log(members.filter((m) => !m.isFollowedByMe && !m.followModule)[1].handle);

        setProfiles(members ?? []);
      });
    }
  }, [lensListsProfiles, activeProfile]);

  return (
    <>
      <Head>
        <title>SocialLens</title>
        <meta name="description" content="SocialPlaza" />
      </Head>
      <div className="space-y-2">
        <section className="flex justify-between">
          <div className="flex space-x-2">
            <div>
              <label htmlFor="location" className="sr-only">
                Location
              </label>
              <select
                id="location"
                name="location"
                className="rounded-md border px-2 py-1 text-sm"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={"Location"}
              >
                <option>Location</option>
              </select>
            </div>
            <div>
              <label htmlFor="event" className="sr-only">
                Event
              </label>
              <select
                id="event"
                name="event"
                className="rounded-md border px-2 py-1 text-sm"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={"Event"}
              >
                <option>Event</option>
              </select>
            </div>
            <div>
              <label htmlFor="following" className="sr-only">
                Following
              </label>
              <select
                id="following"
                name="following"
                className="rounded-md border px-2 py-1 text-sm"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={"All"}
              >
                <option>All</option>
                <option>Following</option>
                <option>Not following</option>
              </select>
            </div>
            <FollowAll profiles={profiles} />
          </div>
          <div>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="search"
                name="search"
                className="rounded-md border py-1 pr-2 pl-10 text-sm"
                onChange={(event) => setSearchFilter(event.target.value)}
                value={""}
              />
            </div>
          </div>
        </section>
        <section>
          <ProfilesList profiles={profiles} />
        </section>
      </div>
    </>
  );
};

export default Home;
