import WardsDisplay from "@/components/WardsDisplay/WardsDisplay";
import { Metadata } from "next";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Biomedical IQ - Medical Equipment Maintenance Platform",
  description: "Biomedical IQ - Your advanced platform for Healthcare Equipment Maintenance and Management.",
};

const WardsPage: React.FC = () => {
  return (
    <DefaultLayout>
      <WardsDisplay />
    </DefaultLayout>
  );
};

export default WardsPage;