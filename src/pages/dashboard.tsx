import { useState } from "react";
import { DashboardLayout } from "../components/custom/DashboardLayout";
import { CreateCollectionForm } from "../components/custom/CreateCollectionForm";
import { Button } from "../components/ui/button";
import { AllCollections } from "@/components/custom/AllCollections";
import { toast } from "sonner";
import { getCollection } from "../api";
import { useQuery } from "@tanstack/react-query";
import ReviewerDashboard from "@/components/custom/Reviewer/Reviewer";

export interface Collection {
  _id: string;
  name: string;
  collectionId: string;
  title: string;
  description: string;
  category?: string;
  author?: string;
  language: string;
  difficulty: string;
  status: string;
  tags?: string[];
}

export default function DashboardPage({
  role,
}: {
  role: "author" | "reviewer";
}) {
  const [section, setSection] = useState<string>("Dashboard");

  const {
    data: collections = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollection,
  });

  if (isError) {
    toast.error(error?.message || "Failed to load collections.");
  }

  return (
    <DashboardLayout setSection={setSection} section={section} role={role}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        {role === "author" && (
          <Button
            className="bg-brand hover:bg-brand-dark text-white w-36 h-8 text-sm text-wrap md:w-40 md:h-10 md:text-md"
            onClick={() => setSection("Create Collection")}
          >
            + Create Collection
          </Button>
        )}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        section === "Dashboard" &&
        role === "author" &&
        (collections.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No collections yet. Click “Create Collection” to start.
          </div>
        ) : (
          <AllCollections collections={collections} />
        ))
      )}

      {section === "Dashboard" && role === "reviewer" && <ReviewerDashboard />}

      {section === "Create Collection" && role === "author" && (
        <CreateCollectionForm />
      )}
    </DashboardLayout>
  );
}
