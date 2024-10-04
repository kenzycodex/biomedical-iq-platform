import React from "react";
import Image from "next/image";

interface UserProfile {
  full_name?: string;
  profile_picture?: string;
}

const GetUserAvatarJSX = (
  profile_picture: string | File | null,
  width: number = 120,
  height: number = 120
) => {
  // If profile picture is available
  if (profile_picture) {
    const imgSrc = profile_picture instanceof File
      ? URL.createObjectURL(profile_picture)
      : profile_picture;

    return (
      <div
        className="overflow-hidden rounded-full"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src={imgSrc}
          alt="User"
          width={width}
          height={height}
          className="object-cover"
        />
      </div>
    );
  }

  // Retrieve user profile from local storage
  const getUserProfile = (): UserProfile | null => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userProfile");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  };

  const userProfile = getUserProfile();

  if (userProfile?.profile_picture) {
    return (
      <div
        className="overflow-hidden rounded-full"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src={userProfile.profile_picture}
          alt="User"
          width={width}
          height={height}
          className="object-cover"
        />
      </div>
    );
  }

  if (userProfile?.full_name) {
    const initials = userProfile.full_name
      .split(" ")
      .map((name: string) => name.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

    return (
      <div
        className="flex items-center justify-center rounded-full border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      U
    </div>
  );
};

export default GetUserAvatarJSX;
