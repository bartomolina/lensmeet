import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import axios from "axios";
import { useActiveProfile, useApolloClient } from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { exploreProfiles } from "../lib/api";
import ProfilesList from "../components/profiles-list";

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
        query: gql(exploreProfiles),
        fetchPolicy: "no-cache",
        variables: {
          profiles: lensListsProfiles,
        },
      }).then((response) => {
        console.log(response?.data?.profiles?.items.length);
        let members = response?.data?.profiles?.items;
        members = [...members].sort((a, b) => b.stats.totalPublications - a.stats.totalPublications);
        members = members.sort((a, b) => a.isFollowedByMe - b.isFollowedByMe);
        console.log(members);

        setProfiles(members ?? []);
      });
    }
  }, [lensListsProfiles, activeProfile]);

  return (
    <>
      <Head>
        <title>SocialPlaza</title>
        <meta name="description" content="SocialPlaza" />
      </Head>
      <section>
        <ProfilesList profiles={profiles} />
      </section>
    </>
  );
};

export default Home;
