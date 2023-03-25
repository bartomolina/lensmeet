import { FormEvent } from "react";
import {
  useActiveProfile,
  useCollect,
  AnyPublicationFragment,
  ProfileOwnedByMeFragment,
} from "@lens-protocol/react-web";

type Props = {
  publication: AnyPublicationFragment;
};

const CollectButton = ({ publication }: Props) => {
  const { data: activeProfile, loading } = useActiveProfile();
  const { execute: follow, isPending } = useCollect({
    collector: activeProfile as ProfileOwnedByMeFragment,
    publication,
  });

  const handleCollect = async(event: FormEvent) => {
    event.preventDefault();
    console.log(publication);
    console.log(loading);
    console.log("Active profile: ", activeProfile);
    // console.log("Collecting: ", activeProfile);
    // console.log("Publication: ", publication);
    // follow().catch(console.log);
    // console.log("Done");
  }

  return (
    <>
      <button onClick={handleCollect} className="border border-lime-500 rounded-md px-3 py-1 hover:bg-lime-50">
        🫡 I&apos;m going
      </button>
    </>
  );
};

export default CollectButton;
