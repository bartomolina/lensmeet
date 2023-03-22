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
        <button onClick={follow} className="border-2 border-red-700 rounded-md px-3 py-1">
          <UserMinusIcon className="h-4 w-4 text-red-700" />
        </button>
      ) : (
        <button onClick={follow} className="border-2 border-lime-700 rounded-md px-3 py-1">
          <UserPlusIcon className="h-4 w-4 text-lime-700" />
        </button>
      )}
    </>
  );
};

export default FollowButton;
