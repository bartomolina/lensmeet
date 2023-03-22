import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useActiveProfile, useUpdateProfileDetails } from "@lens-protocol/react-web";
import { getPictureURL } from "../lib/utils";

const Profile = () => {
  const { data: profile, loading } = useActiveProfile();
  const { execute, error, isPending } = useUpdateProfileDetails({ profile, upload });
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (profile && !loading) {
      console.log(profile);
      const getProfileAttribute = (attribute: string) => {
        return profile.attributes[attribute] ? profile.attributes[attribute].attribute.value : null;
      };
      setFormData({
        location: getProfileAttribute("location"),
        website: getProfileAttribute("website"),
        twitter: getProfileAttribute("twitter"),
        linkedin: getProfileAttribute("linkedin"),
      });
    }
  }, [profile, loading]);

  const handleFormChange = (event: FormEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.currentTarget.id]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <>
      {profile && !loading && (
        <div className="border rounded shadow-sm bg-white">
          <div
            className="inline-block min-h-max h-32 w-full bg-purple-300"
            style={{
              backgroundImage: `url("/bg.svg")`,
            }}
          ></div>
          <div className="grid grid-cols-4 gap-x-2 pb-10">
            <div className="ml-8 space-y-3">
              <Image
                src={getPictureURL(profile)}
                alt={profile.handle}
                width={135}
                height={135}
                className="rounded-md -mt-16 border-white"
              />
              <div className="flex items-center justify-between">
                <div>
                  {profile.name && <p className="text-lg font-medium">{profile.name}</p>}
                  <p className="-mt-1 text-xs text-lime-700">{profile.handle}</p>
                </div>
              </div>
            </div>
            <div className="pt-8 px-8 col-span-3 w-full">
              <form className="space-y-7 divide-y" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                      Location
                    </label>
                    <div className="mt-2 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="twitter" className="text-sm font-medium">
                      Twitter
                    </label>
                    <div className="mt-1 flex shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm border-gray-300 text-gray-500">
                        twitter.com/
                      </span>
                      <input
                        type="text"
                        name="twitter"
                        id="twitter"
                        value={formData.twitter}
                        onChange={handleFormChange}
                        className="w-full rounded-r-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-5">
                  <button
                    type="submit"
                    className="border rounded-md px-3 py-1 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
