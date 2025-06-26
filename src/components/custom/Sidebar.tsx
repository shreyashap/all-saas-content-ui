import { Home, Menu, Plus, X } from "lucide-react";
import clsx from "clsx";
import { Button } from "../ui/button";
import React, { useState, type SetStateAction } from "react";

const navItemsAuthor = [
  { label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { label: "Create Collection", icon: <Plus className="w-5 h-5" /> },
];

const navItemsReviewer = [
  { label: "Dashboard", icon: <Home className="w-5 h-5" /> },
];

export const Sidebar = ({
  setSection,
  section,
  role,
}: {
  setSection: React.Dispatch<SetStateAction<string>>;
  section: string;
  role: "author" | "reviewer";
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = (item: { label: string; icon: React.ReactNode }) => {
    setSection(item.label);
  };

  return (
    <>
      <div className="shadow md:hidden absolute top-0">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <aside
        className={clsx(
          "w-48 md:w-64 h-screen bg-[#3730A3] text-white fixed shadow-lg md:block transition-transform transform md:translate-x-0",
          open ? "block translate-x-0" : "hidden -translate-x-full"
        )}
      >
        <div className="p-6 text-2xl font-bold tracking-tight inline-flex">
          <span>📚 Saas Content</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="mt-10 flex flex-col gap-3 px-6">
          {role === "author" &&
            navItemsAuthor.map((item, i) => (
              <a
                key={i}
                href="#"
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                  "hover:bg-[#6366f1] hover:text-white transition",
                  section === item.label && "bg-[#6366f1]"
                )}
                onClick={() => handleClick(item)}
              >
                {item.icon}
                {item.label}
              </a>
            ))}

          {role === "reviewer" &&
            navItemsReviewer.map((item, i) => (
              <a
                key={i}
                href="#"
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                  "hover:bg-[#6366f1] hover:text-white transition",
                  section === item.label && "bg-[#6366f1]"
                )}
                onClick={() => handleClick(item)}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
        </nav>
      </aside>
    </>
  );
};
