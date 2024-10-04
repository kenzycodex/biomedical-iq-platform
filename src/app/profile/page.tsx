"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import GetUserAvatarJSX from "@/components/GetUserAvatarJSX";

const Profile = () => {
  const [profile_picture, setProfilePicture] = useState<string | File | null>(null);
  const [user, setUser] = useState({
    full_name: "Loading...",
    organization: "Loading...",
    about_us: "Loading..."
  });

  useEffect(() => {
    // Load user profile data from local storage
    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      const parsedProfile = JSON.parse(storedUserProfile);
      setUser({
        full_name: parsedProfile.full_name || "User",
        organization: parsedProfile.organization || "Organization",
        about_us: parsedProfile.about_us || "No information available about this user or organization."
      });
      setProfilePicture(parsedProfile.profile_picture || null);
    } else {
      setUser({
        full_name: "User",
        organization: "Organization",
        about_us: "No information available about this user or organization."
      });
    }
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-64 md:h-96">
            <Image
              src="/images/cover/cover-01.png"
              alt="profile cover"
              className="h-full w-full object-cover rounded-t-sm"
              width={970}
              height={260}
              priority
            />
            <div className="absolute bottom-4 right-4">
              <label
                htmlFor="cover"
                className="flex items-center cursor-pointer justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80"
              >
                <input
                  type="file"
                  name="cover"
                  id="cover"
                  className="sr-only"
                  onChange={(e) => {
                    // handle the file change logic here
                  }}
                />
                <span>
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span>Edit Cover</span>
              </label>
            </div>
          </div>

          <div className="px-4 pb-8 text-center">
            <div className="relative z-30 mx-auto -mt-20 h-40 w-40 sm:h-56 sm:w-56 rounded-full p-2 bg-white">
              <div className="relative w-full h-full">
                {GetUserAvatarJSX(profile_picture, 160, 160)}
              </div>

              <label
                htmlFor="profile"
                className="absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-opacity-90"
              >
                <svg
                  className="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                    fill="white"
                  />
                </svg>
                <input
                  type="file"
                  name="profile"
                  id="profile"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfilePicture(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                {user.full_name}
              </h3>
              <p className="font-medium">{user.organization}</p>

              {/* Stats section */}
              <div className="grid grid-cols-3 gap-2 py-4 max-w-lg mx-auto border-t border-b mt-6 dark:border-strokedark">
                <div className="text-center">
                  <span className="block text-xl font-bold">10</span>
                  <span className="text-sm">Wards</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold">35</span>
                  <span className="text-sm">Equipments</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold">100+</span>
                  <span className="text-sm">Reports</span>
                </div>
              </div>

              {/* About Us Section */}
              <div className="mt-6">
                <h4 className="font-semibold text-black dark:text-white">About Us</h4>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.about_us}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;