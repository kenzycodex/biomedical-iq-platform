"use client";

import { useState, useCallback, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { RingLoader } from "react-spinners";
import { showToast } from "@/components/Notifications/ToastNotification";
import GetUserAvatarJSX from '@/components/GetUserAvatarJSX';

const DropdownUser = () => {
  const [user, setUser] = useState<{ full_name?: string; organization?: string; profile_picture?: string | File | null } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile_picture, setProfilePicture] = useState<string | File | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load user profile data from local storage
    try {
      const storedUserProfile = localStorage.getItem('userProfile');
      if (storedUserProfile) {
        const parsedProfile: { full_name?: string; organization?: string; profile_picture?: string | File | null } = JSON.parse(storedUserProfile);
        setUser(parsedProfile);
        setProfilePicture(parsedProfile.profile_picture || null);
      }
    } catch (error) {
      console.error('Failed to load user profile from local storage:', error);
      showToast('Failed to load user profile. Please refresh the page.', 'error');
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // If logout was successful, clear local storage
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');

        // Show success toast notification
        showToast('Logout successful. Redirecting...', 'success');

        // Delay the navigation to ensure the toast is shown
        setTimeout(() => {
          setIsLoading(false);  // Stop loading state before navigation
          router.push('/auth/signin');  // Redirect to signin page
        }, 1000);  // Give a 1-second window before redirecting
      }
    } catch (error) {
      // Handle any error that occurs during logout
      console.error('Logout error: ', error);
      showToast('Failed to log out. Please try again later.', 'error');
      setIsLoading(false);  // Ensure loading state is stopped in case of error
    }
  }, [router]);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user ? user.full_name : 'User Name'}
          </span>
          <span className="block text-xs">
            {user ? user.organization : 'User Role'}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          {GetUserAvatarJSX(profile_picture, 56, 56)}
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                {/* Profile Icon */}
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG content */}
                </svg>
                My Profile
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                {/* Settings Icon */}
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG content */}
                </svg>
                Account Settings
              </Link>
            </li>
          </ul>
          <button
            className={`flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base ${isLoading ? "cursor-not-allowed" : ""}`}
            onClick={handleLogout}
            disabled={isLoading}
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG content for logout */}
            </svg>
            {isLoading ? (
              <div className="flex justify-center items-center">
                Signing out...
              </div>
            ) : (
              "Sign Out"
            )}
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;