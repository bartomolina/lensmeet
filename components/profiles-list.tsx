import ProfileDetails from "./profile-details";

const ProfilesList = ({ profiles }) => (
  <ul className="space-y-4">{profiles && profiles.map((profile) => <ProfileDetails key={profile.id} profile={profile} />)}</ul>
);

export default ProfilesList;
