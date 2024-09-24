import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Biomedical IQ - Reset Password",
  description: "This is the Forgot Password Page of Biomedical IQ Platform",
};

const ForgotPassword: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Forgot Password" />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Enter your email address below and we'll send you a link or code to reset
              your password.
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-md border border-gray-300 px-3 py-4 placeholder-gray-500 text-gray-900 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-form-input dark:border-form-strokedark dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                    required
                  />
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
              >
                Reset Password
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-primary hover:underline dark:text-primary">
            Back to Sign In
          </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ForgotPassword;
