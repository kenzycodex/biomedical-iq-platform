// src/components/AuthChecker.tsx
"use client";  // Client Component to handle authentication logic

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignIn from "@/app/auth/signin/page";
import axios from "axios";

export default function AuthChecker() {
  const [isLoading, setIsLoading] = useState(true); // Loading state to avoid flickering
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Function to handle token refresh and session check
  const checkSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // If access token is found, user is authenticated
      setIsAuthenticated(true);
      router.push("/dashboard");
    } else if (refreshToken) {
      // If only refresh token is found, try to refresh the access token
      try {
        const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://biomedical-iq-backend.onrender.com";
        const response = await axios.post(`${apiUrl}/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (response.status === 200) {
          const { access_token } = response.data;
          localStorage.setItem("accessToken", access_token); // Store new access token
          setIsAuthenticated(true);
          router.push("/dashboard");
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (err) {
        // If refresh fails, clear storage and stay on sign-in page
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
      }
    } else {
      // If no tokens are found, the user is not authenticated
      setIsAuthenticated(false);
    }

    setIsLoading(false); // Mark loading as complete
  };

  // Run the session check on component mount
  useEffect(() => {
    checkSession();
  }, []);

  if (isLoading) {
    // Show a loading indicator while checking session status
    return <div>Loading...</div>;
  }

  // If authenticated, user will be redirected to the dashboard
  // If not, render the sign-in page
  return isAuthenticated ? null : <SignIn />;
}
