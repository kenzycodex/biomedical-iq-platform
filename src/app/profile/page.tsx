"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import GetUserAvatarJSX from "@/components/GetUserAvatarJSX";

const Profile = () => {
  const [profile_picture, setProfilePicture] = useState<string | File | null>(null);
  const [user, setUser] = useState({
    full_name: "Loading...",
    organization: "Loading...",
    about_us: "Loading...",
  });

  useEffect(() => {
    // Load user profile data from local storage
    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      const parsedProfile = JSON.parse(storedUserProfile);
      setUser({
        full_name: parsedProfile.full_name || "User",
        organization: parsedProfile.organization || "Organization",
        about_us: parsedProfile.about_us || "No information available about this user or organization.",
      });
      setProfilePicture(parsedProfile.profile_picture || null);
    } else {
      setUser({
        full_name: "User",
        organization: "Organization",
        about_us: "No information available about this user or organization.",
      });
    }
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* Cover Image */}
          <div className="relative z-20 h-64 md:h-96">
            <Image
              src="/images/cover/cover-01.png"
              alt="profile cover"
              className="h-full w-full object-cover rounded-t-sm"
              width={970}
              height={260}
              priority
            />
          </div>

          {/* Profile Section */}
          <div className="px-4 pb-8 text-center">
            <div className="relative z-30 mx-auto -mt-20 h-40 w-40 sm:h-56 sm:w-56 rounded-full p-1 bg-white dark:bg-boxdark border-4 border-darkblue-500">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                {GetUserAvatarJSX(profile_picture, 160, 160)}
              </div>
            </div>

            {/* User Information */}
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
