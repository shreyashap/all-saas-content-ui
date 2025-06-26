import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadCloud, FilePlus } from "lucide-react";
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

  // You can still add a check for no ID to return early or display a specific message
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
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e4ebf5] p-6">
      {/* Collection Info Card */}
      <div className="bg-white rounded-lg shadow-md border-t-4 border-indigo-500 p-6 mb-10 transition-all hover:shadow-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-indigo-500"
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
            <p className="mt-4 text-indigo-600 font-medium">
              Loading collection details...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
            <p className="mt-4 font-medium">
              Failed to load collection details.
            </p>
            <p className="text-sm text-gray-500">
              Please try refreshing the page.
            </p>
          </div>
        ) : !collection ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.432a8.92 8.92 0 013.12 0m-4.24-8.882l2.427 1.396a.75.75 0 001.066-1.066l-1.396-2.427a.75.75 0 00-1.066 1.066zm-5.232-.734L6.155 12.39a.75.75 0 00-1.066-1.066l1.396-2.427a.75.75 0 001.066 1.066zM12 12.75l-4.5 9.75M12 12.75L7.5 3"
              />
            </svg>
            <p className="mt-4 font-medium">
              Collection not found or data is empty.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                  {collection.name}
                </h1>
                <p className="text-gray-600 mt-1">{collection.description}</p>
              </div>
              <Badge
                variant="outline"
                className="bg-indigo-100 text-indigo-800 border-indigo-200 px-3 py-1 rounded-full text-sm capitalize"
              >
                {collection.status}
              </Badge>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-500">Author:</span>{" "}
                {collection.author || "Unknown"}
              </div>
              <div>
                <span className="font-semibold text-gray-500">Language:</span>{" "}
                {collection.language}
              </div>
              {collection.category && (
                <div>
                  <span className="font-semibold text-gray-500">Category:</span>{" "}
                  {collection.category}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {collection && (
        <div className="flex flex-wrap gap-4 mb-12">
          <Dialog open={showSingleForm} onOpenChange={setShowSingleForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow hover:scale-[1.02] transition-transform">
                <FilePlus className="mr-2 h-4 w-4" />
                Add Single Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogTitle className="text-lg font-semibold">
                Add Content
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new content item to this
                collection.
              </DialogDescription>
              <SingleContentForm
                collectionId={collection.collectionId}
                onSuccess={() => {
                  setShowSingleForm(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showBulkForm} onOpenChange={setShowBulkForm}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 shadow-sm"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogTitle className="text-lg font-semibold">
                Bulk Upload
              </DialogTitle>
              <DialogDescription>Use file to upload content</DialogDescription>
              <BulkUploadForm
                collectionId={collection.collectionId}
                onSuccess={() => {
                  setShowBulkForm(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {collection && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-dashed border-gray-300 py-10 px-6 text-center text-gray-500 shadow-inner relative overflow-hidden">
          <h2 className="text-left text-xl my-4 font-bold">All Content</h2>
          <ContentCard collectionId={collection.collectionId} />
        </div>
      )}
    </div>
  );
}
