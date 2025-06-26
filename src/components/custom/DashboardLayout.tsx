import type React from "react";
import { Sidebar } from "./Sidebar";
import type { SetStateAction } from "react";

export const DashboardLayout = ({
  children,
  setSection,
  section,
  role,
}: {
  children: React.ReactNode;
  setSection: React.Dispatch<SetStateAction<string>>;
  section: string;
  role: "author" | "reviewer";
}) => {
  return (
    <div className="flex">
      <Sidebar setSection={setSection} section={section} role={role} />
      <main className="md:ml-60 p-10 w-full bg-gradient-to-r from-gray-50 to-blue-50 min-h-screen">
        {children}
      </main>
    </div>
  );
};
