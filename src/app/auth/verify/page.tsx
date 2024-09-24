import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Biomedical IQ - Verify Code",
  description: "This is the Verify 2FA Code page for Biomedical IQ Platform",
};

const VerifyCode: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");

  const handleInputChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const updatedCode = [...code];
      updatedCode[index] = value;
      setCode(updatedCode);
      setError(""); // Reset error on valid input

      // Auto-focus on the next input block
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      // Add logic to verify the 2FA code here
      console.log("2FA Code:", fullCode);
      setError(""); // Clear error if code is valid
    } else {
      setError("Please enter a valid 6-digit code.");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Verify 2FA Code" />

      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-boxdark">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-boxdark shadow-xl rounded-lg transform transition-all hover:shadow-2xl">
          <div className="text-center">
            <Link href="/">
              <Image
                className="mb-6 dark:hidden"
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src={"/images/logo/logo.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Enter 2FA Code
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              We&#39;ve sent a 6-digit code to your email. Please enter it below to verify your identity.
            </p>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                maxLength={1}
                className={`w-12 h-12 border rounded-md text-center text-xl font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none 
                  ${error ? "border-red-500" : "border-gray-300"} dark:border-strokedark dark:bg-boxdark dark:text-white`}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:outline-none font-medium transition-all duration-200 ease-in-out"
          >
            Verify Code
          </button>

          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-300">
            Didn&#39;t receive the code?{" "}
            <Link href="/resend" className="text-blue-500 hover:underline">
                Resend
            </Link>
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VerifyCode;
