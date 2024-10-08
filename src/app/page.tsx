// src/app/page.tsx

import { Metadata } from "next";
import AuthChecker from "@/components/AuthChecker"; // Import the client-side component

export const metadata: Metadata = {
  title: "Biomedical IQ - Medical Equipment Maintenance Platform",
  description:
    "Biomedical IQ - Your advanced platform for Healthcare Equipment Maintenance and Management.",
};

export default function Home() {
  return (
    <div>
      {/* Client-side authentication logic is handled in AuthChecker */}
      <AuthChecker />
    </div>
  );
}