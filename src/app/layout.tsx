"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error('Google Client ID is not defined');
    return null;
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {loading ? <Loader /> : children}
            </div>
          </GoogleOAuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}