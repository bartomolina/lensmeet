import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import { useFollow, useActiveProfile } from "@lens-protocol/react-web";

const FollowButton = ({ profile, from }) => {
  const { data: activeProfile } = useActiveProfile();
  const { execute: follow, isPending } = useFollow({ followee: profile, follower: from });

  return (
    <>
      {profile.id === activeProfile?.id ? (
        <></>
      ) : profile.followStatus.isFollowedByMe ? (
        <button onClick={follow} className="border border-red-500 rounded-md px-3 py-1 hover:bg-red-50">
          <UserMinusIcon className="h-4 w-4 text-red-500" />
        </button>
      ) : (
        <button onClick={follow} className="border border-lime-500 rounded-md px-3 py-1 hover:bg-lime-50">
          <UserPlusIcon className="h-4 w-4 text-lime-500" />
        </button>
      )}
    </>
  );
};

export default FollowButton;
