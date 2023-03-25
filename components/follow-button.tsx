import { FormEvent, useEffect } from "react";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import { useFollow, useUnfollow, ProfileFragment, ProfileOwnedByMeFragment } from "@lens-protocol/react-web";
import { useNotifications } from "./notifications-context";

type Props = {
  follower: ProfileOwnedByMeFragment;
  followee: ProfileFragment;
};

const FollowButton = ({ follower, followee }: Props) => {
  const { execute: follow, isPending: isFollowPending, error: followError } = useFollow({ follower, followee });
  const { execute: unfollow, isPending: isUnfollowPending, error: unfollowError } = useUnfollow({ follower, followee });
  const { showNotification, showError } = useNotifications();

  const handleFollow = (event: FormEvent, action: () => Promise<any>, message: string) => {
    event.preventDefault();
    action()
      .then((result) => {
        if (!result.error) {
          showNotification(`${message} done`, `You're now ${message.toLowerCase()} ${followee.handle}`);
        }
      })
      .catch((error) => {
        showError("Error", error.message);
      });
  };

  useEffect(() => {
    if (followError) {
      showError(`Error following ${followee.handle}`, followError.message);
    }
    if (unfollowError) {
      showError(`Error unfollowing ${followee.handle}`, unfollowError.message);
    }
  }, [followError, unfollowError]);

  return (
    <>
      {followee.id != follower?.id && (
        <>
          {followee.followStatus && followee.followStatus.isFollowedByMe ? (
            <button
              onClick={(e) => handleFollow(e, unfollow, "Unfollowing")}
              disabled={isUnfollowPending}
              className={`border rounded-md px-3 py-1 bg-opacity-20 ${
                isUnfollowPending
                  ? "border-gray-500 text-gray-900 bg-gray-100"
                  : "border-red-500 text-red-900 bg-red-50 hover:bg-red-100"
              }`}
            >
              <UserMinusIcon className={`h-4 w-4 ${isUnfollowPending ? "text-gray-500" : "text-red-500"}`} />
            </button>
          ) : (
            <button
              onClick={(e) => handleFollow(e, follow, "Following")}
              disabled={isFollowPending}
              className={`border rounded-md px-3 py-1 bg-opacity-20 ${
                isFollowPending
                  ? "border-gray-500 text-gray-900 bg-gray-100"
                  : "border-lime-500 text-lime-900 bg-lime-50 hover:bg-lime-100"
              }`}
            >
              <UserPlusIcon className={`h-4 w-4 ${isFollowPending ? "text-gray-500" : "text-lime-500"}`} />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default FollowButton;
