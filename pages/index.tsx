import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import axios from "axios";
import { useActiveProfile, useApolloClient, ProfileFragment } from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { getMembers } from "../lib/api";
import ProfilesList from "../components/profiles-list";
import FollowAll from "../components/follow-all";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Home = () => {
  const { data: listMembers } = useSWR("/lenslists/lists/845068988534030337/members", fetcher);
  const { data: listInfo } = useSWR("/lenslists/lists/845068988534030337", fetcher);
  const { data: activeProfile, loading: profileLoading } = useActiveProfile();
  const [searchFilter, setSearchFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [followingFilter, setFollowingFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const { query } = useApolloClient();
  const [profiles, setProfiles] = useState<Array<ProfileFragment>>([]);

  const lensListsProfiles = useMemo(() => {
    let members = [] as ProfileFragment[];
    if (listInfo && listMembers && listMembers.data?.members?.items) {
      let prod = true;
      if (process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase() === "staging") {
        prod = false;
      }
      const stagingProfiles = ["bartomolina.test", "bartomolina1.test", "bartomolina2.test"];
      // @ts-ignore
      return prod ? listMembers.data.members.items.map((p) => p.profileId) : stagingProfiles;
    }
    return members;
  }, [listMembers, listInfo]);

  const listOwner = useMemo(() => {
    return listInfo?.data?.list?.ownerProfile?.id || null;
  }, [listInfo]);

  useEffect(() => {
    if (lensListsProfiles && lensListsProfiles.length && !profileLoading) {
      query({
        query: gql(getMembers),
        fetchPolicy: "no-cache",
        variables: {
          profiles: lensListsProfiles,
        },
      }).then((response) => {
        // @ts-ignore
        let members = response?.data?.profiles?.items;
        members = [...members].sort((a, b) => b.stats.totalPublications - a.stats.totalPublications);
        console.log("Members... ", members);
        setProfiles(members ?? []);
      });
    }
  }, [lensListsProfiles, profileLoading, query]);

  const filteredProfiles = useMemo(() => {
    let filtered = [...profiles];

    if (searchFilter) {
      filtered = filtered.filter(
        (profile: ProfileFragment) =>
          profile.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
          profile.handle.toLowerCase().includes(searchFilter.toLowerCase()) ||
          profile.bio?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(
        // @ts-ignore
        (profile) => profile.attributes?.find((attr) => attr.key === "location")?.value === locationFilter
      );
    }

    if (followingFilter) {
      const following = followingFilter === "Following";
      // @ts-ignore
      filtered = filtered.filter((profile) => profile.isFollowedByMe === following);
    }

    if (listOwner) {
      let index = filtered.findIndex((member) => member.id === listOwner);
      if (index !== -1) {
        filtered.splice(index, 1);
      }
      index = profiles.findIndex((member) => member.id === listOwner);
      if (index !== -1) {
        filtered.unshift(profiles[index]);
      }
    }

    return filtered;
  }, [profiles, searchFilter, locationFilter, followingFilter, listOwner]);

  const locations = useMemo(() => {
    let groupedLocations = new Set(
      // @ts-ignore
      profiles.map((profile) => profile.attributes?.find((attr) => attr.key === "location")?.value)
    );
    groupedLocations.delete(undefined);
    return groupedLocations;
  }, [profiles]);

  return (
    <>
      <Head>
        <title>LensMeet</title>
        <meta name="description" content="LensMeet" />
      </Head>
      <div className="space-y-4">
        <section className="space-y-3">
          <div className="flex justify-between">
            <div className="space-x-3">
              <span className="text-sm italic text-gray-700">
                Showing <strong className="text-gray-900">{filteredProfiles.length}</strong> member(s)
              </span>
              <FollowAll />
            </div>
            <div>
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="search"
                  name="search"
                  className="rounded-md border py-1 pr-2 pl-8 text-sm"
                  onChange={(event) => setSearchFilter(event.target.value)}
                  value={searchFilter}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <div>
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  className="rounded-md border px-2 py-1 text-sm"
                  onChange={(event) => setLocationFilter(event.target.value)}
                  value={locationFilter}
                >
                  <option value="">Location</option>
                  {locations &&
                    [...Array.from(locations)].map((location) => <option key={location}>{location}</option>)}
                </select>
              </div>
              {activeProfile && !profileLoading && (
                <div>
                  <label htmlFor="following" className="sr-only">
                    Following
                  </label>
                  <select
                    id="following"
                    name="following"
                    className="rounded-md border px-2 py-1 text-sm"
                    onChange={(event) => setFollowingFilter(event.target.value)}
                    value={followingFilter}
                  >
                    <option value="">Following?</option>
                    <option>Following</option>
                    <option>Not following</option>
                  </select>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="event" className="sr-only">
                Event
              </label>
              <select
                id="event"
                name="event"
                className="rounded-md border px-2 py-1 text-sm"
                onChange={(event) => setEventFilter(event.target.value)}
                value={eventFilter}
              >
                <option>Event</option>
              </select>
            </div>
          </div>
        </section>
        <section>
          <ProfilesList profiles={filteredProfiles} owner={listOwner} />
        </section>
      </div>
    </>
  );
};

export default Home;
