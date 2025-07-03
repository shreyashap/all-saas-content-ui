import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadCloud, FilePlus, Pencil, Globe, BookText } from "lucide-react";
import SingleContentForm from "../components/custom/Collection/SingleContentForm";
import BulkUploadForm from "../components/custom/Collection/BulkUploadContent";
import { Badge } from "../components/ui/badge";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getByCollectionId } from "../api/collection-api";
import ContentCard from "../components/custom/Author/ContentCard";

interface CollectionDetailsData {
  _id: string;
  name: string;
  description: string;
  language: string;
  author?: string;
  category?: string;
  status: string;
  collectionId: string;
}

export default function CollectionDetailsPage() {
  const { id } = useParams();

  const {
    data: collection,
    isLoading,
    isError,
  } = useQuery<CollectionDetailsData, Error>({
    queryKey: ["collectionId", id],
    queryFn: () => getByCollectionId(id as string),
    enabled: !!id,
  });

  const [showSingleForm, setShowSingleForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);

  // Search and filter states are moved to ContentCard

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#e4ebf5]">
        <p className="text-gray-600 text-lg">
          No collection ID provided in the URL.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e4ebf5] p-4 sm:p-6 lg:p-8">
      {/* Collection Info Card */}
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-indigo-500 p-6 sm:p-8 mb-10 transition-all hover:shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <svg
              className="animate-spin h-10 w-10 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-indigo-600 font-semibold text-lg">
              Loading collection details...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 font-bold text-lg">
              Oops! Failed to load collection.
            </p>
            <p className="text-sm text-red-500">
              Please check your connection or try again later.
            </p>
          </div>
        ) : !collection ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600 bg-blue-50 border border-blue-200 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.432a8.92 8.92 0 013.12 0m-4.24-8.882l2.427 1.396a.75.75 0 001.066-1.066l-1.396-2.427a.75.75 0 001.066 1.066zm-5.232-.734L6.155 12.39a.75.75 0 00-1.066-1.066l1.396-2.427a.75.75 0 001.066 1.066zM12 12.75l-4.5 9.75M12 12.75L7.5 3"
              />
            </svg>
            <p className="mt-4 font-semibold text-lg">Collection not found.</p>
            <p className="text-sm text-blue-500">
              It might have been deleted or doesn't exist.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {collection.name}
                </h1>
                <p className="text-gray-600 mt-2 text-base sm:text-lg">
                  {collection.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-indigo-100 text-indigo-800 border-indigo-200 px-4 py-2 rounded-full text-md font-semibold capitalize shadow-sm shrink-0"
              >
                {collection.status}
              </Badge>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base text-gray-700">
              <div className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-gray-500">
                  Author:
                </span>{" "}
                {collection.author || "Unknown"}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-gray-500">
                  Language:
                </span>{" "}
                {collection.language}
              </div>
              {collection.category && (
                <div className="flex items-center gap-2">
                  <BookText className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold text-gray-500">
                    Category:
                  </span>{" "}
                  {collection.category}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {collection && (
        <div className="mb-12">
          {/* Add/Upload Buttons remain here */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto justify-start mb-8">
            <Dialog open={showSingleForm} onOpenChange={setShowSingleForm}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow hover:scale-[1.02] transition-transform flex items-center gap-2 px-5 py-2 w-full sm:w-auto">
                  <FilePlus className="h-4 w-4" />
                  Add Single Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl">
                <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Add Single Content
                </DialogTitle>
                <DialogDescription className="text-gray-600 mb-4">
                  Fill out the form below to add a new content item to this
                  collection.
                </DialogDescription>
                <SingleContentForm
                  collectionId={collection.collectionId}
                  onCreated={() => setShowSingleForm(false)}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showBulkForm} onOpenChange={setShowBulkForm}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-700 shadow-md flex items-center gap-2 px-5 py-2 w-full sm:w-auto"
                >
                  <UploadCloud className="h-4 w-4" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl">
                <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Bulk Upload Content
                </DialogTitle>
                <DialogDescription className="text-gray-600 mb-4">
                  Use a file to upload multiple content items at once.
                </DialogDescription>
                <BulkUploadForm
                  collectionId={collection.collectionId}
                  onCreated={() => setShowBulkForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* All Content Section */}
          <div className="bg-white rounded-xl border border-gray-200 py-8 px-6 text-center text-gray-500 shadow-inner relative overflow-hidden">
            <h2 className="text-left text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
              All Content
            </h2>
            {/* ContentCard now handles its own search and filter UI */}
            <ContentCard collectionId={collection.collectionId} />
          </div>
        </div>
      )}
    </div>
  );
}
