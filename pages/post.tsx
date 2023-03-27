import { FormEvent, useState } from "react";
import Head from "next/head";
import { upload } from "../lib/utils";
import { ethers } from "ethers";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  useFollow,
  useUnfollow,
  ProfileFragment,
  ProfileOwnedByMeFragment,
  useActiveProfile,
  useApolloClient,
  useCreatePost,
  CollectPolicyType,
  ContentFocus,
  NftAttributeDisplayType,
} from "@lens-protocol/react-web";
import { gql } from "@apollo/client";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import { useNotifications } from "../components/notifications-context";
import { omit, splitSignature, LensHubContract, LensHubAbi, LensFollowAbi, createPostQuery } from "../lib/api";

const PostEvent = () => {
  const { data: profile, loading } = useActiveProfile();
  // @ts-ignore
  const { execute: create, error, isPending } = useCreatePost({ publisher: profile, upload });
  const [formData, setFormData] = useState({
    name: "ETHGlobal Tokyo",
    description: "Meet your friends at ETHGlobal Tokyo. #lensmeet. LensMeet.io",
    location: "Tokyo",
    country: "JP",
    organizer: "ETHGlobal",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
  });
  const { showNotification, showError } = useNotifications();
  const { data: activeProfile } = useActiveProfile();
  const { mutate } = useApolloClient();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const description = event.currentTarget.id === "description" ? event.currentTarget.value : formData.description;
    const endDate = event.currentTarget.id === "endDate" ? event.currentTarget.value : formData.endDate;

    setFormData({
      ...formData,
      [event.currentTarget.id]: event.currentTarget.value,
      description:
        event.currentTarget.id === "name"
          ? `Meet your friends at ${event.currentTarget.value}. #lensmeet. LensMeet.io`
          : description,
      endDate: event.currentTarget.id === "startDate" ? event.currentTarget.value : endDate,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await create({
      content: formData.description,
      contentFocus: ContentFocus.TEXT,
      locale: "en",
      collect: {
        type: CollectPolicyType.FREE,
        metadata: {
          name: formData.name,
          description: formData.description,
          attributes: [
            {
              displayType: NftAttributeDisplayType.String,
              value: formData.location,
              traitType: "Location",
            },
            {
              displayType: NftAttributeDisplayType.String,
              value: formData.country,
              traitType: "Country",
            },
            {
              displayType: NftAttributeDisplayType.String,
              value: formData.organizer,
              traitType: "Organizer",
            },
            {
              displayType: NftAttributeDisplayType.Number,
              value: new Date(formData.startDate).getTime() / 1000,
              traitType: "Start date",
            },
            {
              displayType: NftAttributeDisplayType.Number,
              value: new Date(formData.endDate).getTime() / 1000,
              traitType: "End date",
            },
          ],
        },
        followersOnly: true,
      },
    });
  };

  const handleSubmitAPI = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    if (activeProfile) {
      const attributes = [
        {
          traitType: "Location",
          value: formData.location,
          displayType: NftAttributeDisplayType.String.toLowerCase(),
        },
        {
          traitType: "Country",
          value: formData.country,
          displayType: NftAttributeDisplayType.String.toLowerCase(),
        },
        {
          traitType: "Organizer",
          value: formData.organizer,
          displayType: NftAttributeDisplayType.String.toLowerCase(),
        },
        {
          traitType: "Start date",
          value: (new Date(formData.startDate).getTime() / 1000).toString(),
          displayType: NftAttributeDisplayType.Number.toLowerCase(),
        },
        {
          traitType: "End date",
          value: (new Date(formData.endDate).getTime() / 1000).toString(),
          displayType: NftAttributeDisplayType.Number.toLowerCase(),
        },
      ];
      const postData = {
        version: "2.0.0",
        metadata_id: uuidv4(),
        content: formData.description,
        locale: "en",
        mainContentFocus: "TEXT_ONLY",
        attributes,
        description: formData.description,
        name: formData.name,
      };
      const url = await upload(postData);

      if (isConnected) {
        await disconnectAsync();
      }

      const { connector } = await connectAsync();
      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner();

        const typedResult = await mutate({
          mutation: gql(createPostQuery),
          variables: {
            profileId: activeProfile.id,
            url,
          },
        });

        // @ts-ignore
        const typedData = typedResult.data.createPostTypedData.typedData;
        const lensHub = new ethers.Contract(LensHubContract, LensHubAbi, signer);
        const signature = await await signer._signTypedData(
          omit(typedData.domain, "__typename"),
          omit(typedData.types, "__typename"),
          omit(typedData.value, "__typename")
        );
        const { v, r, s } = splitSignature(signature);

        const result = await lensHub.postWithSig({
          profileId: typedData.value.profileId,
          contentURI: typedData.value.contentURI,
          collectModule: typedData.value.collectModule,
          collectModuleInitData: typedData.value.collectModuleInitData,
          referenceModule: typedData.value.referenceModule,
          referenceModuleInitData: typedData.value.referenceModuleInitData,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        });
        showNotification(
          "Post submitted",
          "Please click here and wait for the transaction to complete and refresh the page after a few seconds",
          result.hash
        );
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>LensMeet</title>
        <meta name="description" content="LensMeet" />
      </Head>
      <div className="border rounded shadow-sm bg-white pb-10">
        <div className="pt-6 px-8 w-full">
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
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <textarea
                    rows={4}
                    name="description"
                    id="description"
                    value={formData.description}
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
                    value={formData.location}
                    onChange={handleFormChange}
                    className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                  Country
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="organizer" className="block text-sm font-medium leading-6 text-gray-900">
                  Organizer
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="organizer"
                    id="organizer"
                    value={formData.organizer}
                    onChange={handleFormChange}
                    className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium leading-6 text-gray-900">
                  Start date
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium leading-6 text-gray-900">
                  End date
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    className="w-full rounded-md p-2 text-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-5">
              <button
                type="submit"
                disabled={submitting}
                className={`border rounded-md px-3 py-1 bg-opacity-20 ${
                  submitting
                    ? "border-gray-500 text-gray-900 bg-gray-100"
                    : "border-lime-500 text-lime-900 bg-lime-50 hover:bg-lime-100"
                }`}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostEvent;
