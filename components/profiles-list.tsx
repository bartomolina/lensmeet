import { ProfileFragment } from "@lens-protocol/react";
import ProfileDetails from "./profile-details";

type Props = {
  profiles: ProfileFragment[];
  owner: string;
};

const ProfilesList = ({ profiles, owner }: Props) => (
  <ul className="space-y-4">
    {profiles && profiles.map((profile) => <ProfileDetails key={profile.id} id={profile.id} isOwner={profile.id === owner} />)}
  </ul>
);

export default ProfilesList;
