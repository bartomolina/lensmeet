import ProfileDetails from "./profile-details";

const ProfilesList = ({ profiles, activeProfile }) => (
  <ul className="space-y-4">
    {profiles &&
      profiles.map((profile) => <ProfileDetails key={profile.id} id={profile.id} activeProfile={activeProfile} />)}
  </ul>
);

export default ProfilesList;
