import React from 'react';
import Image from 'next/image';

interface UserProfile {
  full_name?: string;
  profile_picture?: string;
}

const GetUserAvatarJSX = (profile_picture: string | File | null) => {
  if (profile_picture) {
    const imgSrc = profile_picture instanceof File
      ? URL.createObjectURL(profile_picture)
      : profile_picture;

    return (
      <Image
        src={imgSrc}
        width={56}
        height={56}
        alt="User"
      />
    );
  }

  // Retrieve user profile from local storage
  const getUserProfile = (): UserProfile | null => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userProfile');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  };

  const userProfile = getUserProfile();

  if (userProfile?.profile_picture) {
    return (
      <Image
        src={userProfile.profile_picture}
        width={56}
        height={56}
        alt="User"
      />
    );
  }

  if (userProfile?.full_name) {
    const initials = userProfile.full_name
      .split(' ')
      .map((name: string) => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white">
        {initials}
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white">
      U
    </div>
  );
};

export default GetUserAvatarJSX;