import { ProfileFragment } from "@lens-protocol/react";
import ProfileDetails from "./profile-details";

type Props = {
  profiles: ProfileFragment[];
};

const ProfilesList = ({ profiles }: Props) => (
  <ul className="space-y-4">
    {profiles && profiles.map((profile) => <ProfileDetails key={profile.id} id={profile.id} />)}
  </ul>
);

export default ProfilesList;
