import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Biomedical IQ - Medical Equipment Maintenance Platform",
  description: "Biomedical IQ - Your advanced platform for Healthcare Equipment Maintenance and Management.",
};

const DashboardPage: React.FC = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;