import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import axios from "axios";
import { useActiveProfile, useWalletLogin } from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { getClient, exploreProfiles } from "../lib/api";
import ProfilesList from "../components/profiles-list";
import { useUser } from "../components/user-context";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Home = () => {
  const { data } = useSWR("/lenslists/lists/845068988534030337/members", fetcher);
  const { data: activeProfile, loading: loadingProfile } = useActiveProfile();
  const { accessToken } = useUser();
  const { isPending: loginPending } = useWalletLogin();
  const [profiles, setProfiles] = useState([]);

  const lensListsProfiles = useMemo(() => {
    return data?.data.members.items.map((p) => p.profileId);
  }, [data]);

  useEffect(() => {
    if (lensListsProfiles) {
      const apolloClient = getClient();
      apolloClient
        .query({
          query: gql(exploreProfiles),
          variables: {
            profiles: lensListsProfiles,
          },
        })
        .then((response) => {
          let members = response?.data?.profiles?.items;
          members = [...members].sort((a, b) => b.stats.totalPublications - a.stats.totalPublications);
          members = members.sort((a, b) => a.isFollowedByMe - b.isFollowedByMe);
          console.log(members);

          setProfiles(members ?? []);
        });
    }
  }, [lensListsProfiles, accessToken]);

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
