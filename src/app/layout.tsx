"use client";

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "@/components/Notifications/ToastNotification"; 
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/customTheme'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SessionProvider>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {loading ? <Loader /> : children}
            </div>
            <ToastContainer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}