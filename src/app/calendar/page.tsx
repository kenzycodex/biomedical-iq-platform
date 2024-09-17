import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Biomedical IQ - Medical Equipment Maintenance Platform",
  description: "Biomedical IQ - Your advanced platform for Healthcare Equipment Maintenance and Management.",
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Calendar />
    </DefaultLayout>
  );
};

export default CalendarPage;
