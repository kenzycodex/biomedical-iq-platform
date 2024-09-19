import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Biomedical IQ - Medical Equipment Maintenance Platform",
  description: "Biomedical IQ - Your advanced platform for Healthcare Equipment Maintenance and Management.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}
