import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useProfile } from "@lens-protocol/react-web";
import useSWR from "swr";
import axios from "axios";
import { apolloClient, exploreProfiles } from "../lib/api";
import { gql } from "@apollo/client";
import ProfilesList from "../components/profiles-list";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Home = () => {
  const { data } = useSWR("/lenslists/lists/845068988534030337/members", fetcher);
  const { data: profile, loading } = useProfile({ handle: "bartomolina.lens" });
  const [ profiles, setProfiles ] = useState([]);

  const lensListsProfiles = useMemo(() => {
    return data?.data.members.items.map(p => p.profileId);
  }, [data]);

  useEffect(() => {
    if (lensListsProfiles) {
      apolloClient
        .query({
          query: gql(exploreProfiles),
          variables: {
            profiles: lensListsProfiles,
          },
        })
        .then(response => {
          console.log(response?.data?.profiles?.items);
          setProfiles(response?.data?.profiles?.items ?? [])
        });
    }
  }, [lensListsProfiles]);

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
