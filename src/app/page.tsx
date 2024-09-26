// page.tsx
import DashboardPage from "./dashboard/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biomedical IQ - Medical Equipment Maintenance Platform",
  description:
    "Biomedical IQ - Your advanced platform for Healthcare Equipment Maintenance and Management.",
};

export default function Home() {
  return (
    <>
      <DashboardPage />
    </>
  );
}