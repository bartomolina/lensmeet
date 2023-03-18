import Head from "next/head";
import { useProfile } from '@lens-protocol/react-web';
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const { data } = useSWR("/lenslists/lists/845068988534030337/members", fetcher);
  const { data: profile, loading } = useProfile({ handle: 'bartomolina.lens'});

  console.log(data?.data.members.items);
  console.log(profile);

  return (
    <>
      <Head>
        <title>SocialPlaza</title>
        <meta name="description" content="SocialPlaza" />
      </Head>
    </>
  );
}
