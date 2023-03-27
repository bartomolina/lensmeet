import { FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { ethers } from "ethers";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  ProfileFragment,
  useActiveProfile,
  useApolloClient,
  useUpdateProfileDetails,
  ProfileOwnedByMeFragment,
} from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { useNotifications } from "../components/notifications-context";
import { omit, splitSignature, LensPeripheryContract, LensPeripheryAbi, updateProfileQuery } from "../lib/api";
import { getPictureURL, upload } from "../lib/utils";

const Profile = () => {
  const { data: activeProfile, loading } = useActiveProfile();
  // @ts-ignore
  const { execute: update, error, isPending } = useUpdateProfileDetails({ profile: activeProfile, upload });
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    attributes: {
      location: "",
      website: "",
      twitter: "",
      instagram: "",
      github: "",
      linkedin: "",
    },
  });
  const { mutate } = useApolloClient();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const [updating, setUpdating] = useState(false);
  const { showNotification, showError } = useNotifications();

  useEffect(() => {
    if (activeProfile && !loading) {
      const getProfileAttribute = (attribute: string) => {
        // @ts-ignore
        return activeProfile.attributes[attribute] ? activeProfile.attributes[attribute].attribute.value : null;
      };
      setFormData({
        name: activeProfile.name ?? "",
        bio: activeProfile.bio ?? "",
        attributes: {
          location: getProfileAttribute("location") ?? "",
          website: getProfileAttribute("website") ?? "",
          twitter: getProfileAttribute("twitter") ?? "",
          instagram: getProfileAttribute("instagram") ?? "",
          github: getProfileAttribute("github") ?? "",
          linkedin: getProfileAttribute("linkedin") ?? "",
        },
      });
    }
  }, [activeProfile, loading]);

  const handleFormChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.currentTarget.id === "name" || event.currentTarget.id === "bio"
      ? setFormData({
          ...formData,
          [event.currentTarget.id]: event.currentTarget.value,
        })
      : setFormData({
          ...formData,
          attributes: {
            ...formData.attributes,
            [event.currentTarget.id]: event.currentTarget.value,
          },
        });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await update({
      name: formData.name,
      bio: formData.bio,
      // @ts-ignore
      coverPicture: activeProfile?.coverPicture,
      attributes: formData.attributes,
    });
  };

  const handleSubmitAPI = async (event: FormEvent) => {
    event.preventDefault();
    setUpdating(true);

    if (activeProfile) {
      let attributes = [];
      Object.keys(formData.attributes).forEach((key, index) => {
        attributes.push({
          key,
          value: formData.attributes[key as keyof typeof formData.attributes],
          displayType: "string",
        });
      });
      attributes.push({
        __typename: "Attribute",
        displayType: null,
        key: "app",
        value: "Lenster",
      });
      const profileData = {
        version: "1.0.0",
        metadata_id: uuidv4(),
        attributes: attributes,
        bio: formData.bio,
        name: formData.name,
        cover_picture: activeProfile?.coverPicture,
      };
      const url = await upload(profileData);

      if (isConnected) {
        await disconnectAsync();
      }

      const { connector } = await connectAsync();
      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner();

        const typedResult = await mutate({
          mutation: gql(updateProfileQuery),
          variables: {
            profileId: activeProfile.id,
            url,
          },
        });

        // @ts-ignore
        const typedData = typedResult.data.createSetProfileMetadataTypedData.typedData;
        const lensPeriphery = new ethers.Contract(LensPeripheryContract, LensPeripheryAbi, signer);
        const signature = await await signer._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename")
        );
        const { v, r, s } = splitSignature(signature);

        const result = await lensPeriphery.setProfileMetadataURIWithSig({
          profileId: typedData.value.profileId,
          metadata: typedData.value.metadata,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        });
        showNotification(
          "Profile update in progress",
          "Please click here and wait for the transaction to complete and refresh the page after a few seconds",
          result.hash
        );
      }
    }
    setUpdating(false);
  };

  return (
    <>
      <Head>
        <title>LensMeet</title>
        <meta name="description" content="LensMeet" />
      </Head>
      {activeProfile && !loading && (
        <div className="border rounded shadow-sm bg-white pb-10">
          <div
            className="inline-block min-h-max h-36 w-full bg-purple-300"
            style={{
              backgroundImage: `url("/bg.svg")`,
            }}
          ></div>
          <div className="grid grid-cols-4 gap-x-2">
            <div className="ml-8 space-y-3">
              <Image
                src={getPictureURL(activeProfile)}
                alt={activeProfile.handle}
                width={135}
                height={135}
                className="rounded-md -mt-16 border-white"
              />
              <div className="flex items-center justify-between">
                <div>
                  {activeProfile.name && <p className="text-lg font-medium">{activeProfile.name}</p>}
                  <p className="-mt-1 text-xs text-lime-700">{activeProfile.handle}</p>
                </div>
              </div>
            </div>
            <div className="pt-6 px-8 col-span-3 w-full">
              <form className="space-y-7 divide-y" onSubmit={handleSubmitAPI}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                      Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">
                      Bio
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <textarea
                        rows={4}
                        name="bio"
                        id="bio"
                        value={formData.bio}
                        onChange={handleFormChange}
                        className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                      Location
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.attributes.location}
                        onChange={handleFormChange}
                        className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                      Website
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="website"
                        id="website"
                        value={formData.attributes.website}
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
                        value={formData.attributes.twitter}
                        onChange={handleFormChange}
                        className="w-full rounded-r-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="instagram" className="text-sm font-medium">
                      Instagram
                    </label>
                    <div className="mt-1 flex shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm border-gray-300 text-gray-500">
                        instagram.com/
                      </span>
                      <input
                        type="text"
                        name="instagram"
                        id="instagram"
                        value={formData.attributes.instagram}
                        onChange={handleFormChange}
                        className="w-full rounded-r-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="github" className="text-sm font-medium">
                      GitHub
                    </label>
                    <div className="mt-1 flex shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm border-gray-300 text-gray-500">
                        github.com/
                      </span>
                      <input
                        type="text"
                        name="github"
                        id="github"
                        value={formData.attributes.github}
                        onChange={handleFormChange}
                        className="w-full rounded-r-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="text-sm font-medium">
                      LinkedIn
                    </label>
                    <div className="mt-1 flex shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm border-gray-300 text-gray-500">
                        linkedin.com/in/
                      </span>
                      <input
                        type="text"
                        name="linkedin"
                        id="linkedin"
                        value={formData.attributes.linkedin}
                        onChange={handleFormChange}
                        className="w-full rounded-r-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-5">
                  <button
                    type="submit"
                    disabled={updating}
                    className={`border rounded-md px-3 py-1 bg-opacity-20 ${
                      updating
                        ? "border-gray-500 text-gray-900 bg-gray-100"
                        : "border-lime-500 text-lime-900 bg-lime-50 hover:bg-lime-100"
                    }`}
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
