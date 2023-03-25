import { FormEvent } from "react";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import {
  useFollow,
  useUnfollow,
  useActiveProfile,
  ProfileFragment,
  ProfileOwnedByMeFragment,
} from "@lens-protocol/react-web";
import { useNotifications } from "./notifications-context";

type Props = {
  profile: ProfileFragment;
  from: ProfileOwnedByMeFragment;
};

const FollowButton = ({ profile, from }: Props) => {
  const { data: activeProfile } = useActiveProfile();
  const { execute: follow, isPending: isFollowPending, error: error } = useFollow({ followee: profile, follower: from });
  const { execute: unfollow, isPending: isUnfollowPending } = useFollow({ followee: profile, follower: from });
  const { showNotification, showError } = useNotifications();

  const handleFollow = (event: FormEvent) => {
    event.preventDefault();
    if (profile && profile.followStatus) {
      const action = profile.followStatus.isFollowedByMe ? unfollow : follow;
      console.log("following...");
      unfollow()
      .then(result => {
        console.log("done following...");
        console.log(result);
      })
      .catch(error => {
        console.log("error...");
        console.log(error);
      })
      .finally(() => {
        console.log("finally following...");
      });
    }
    console.log("exit following...");
  };

  return (
    <>
      {profile.id != activeProfile?.id && (
        <>
          {profile.followStatus && profile.followStatus.isFollowedByMe ? (
            <button
              onClick={handleFollow}
              className="border border-red-500 text-red-900 rounded-md px-3 py-1 bg-red-50 bg-opacity-20 hover:bg-red-100"
            >
              <UserMinusIcon className="h-4 w-4 text-red-500" />
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="border border-lime-500 text-lime-900 rounded-md px-3 py-1 bg-lime-50 bg-opacity-20 hover:bg-lime-100"
            >
              <UserPlusIcon className="h-4 w-4 text-lime-500" />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default FollowButton;
