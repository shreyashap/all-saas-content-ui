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
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getByCollectionId } from "../api/collection-api";
import CollectionContent from "../components/custom/Author/CollectionContent";

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

  const { data: collection } = useQuery<CollectionDetailsData, Error>({
    queryKey: ["collectionId", id],
    queryFn: () => getByCollectionId(id as string),
    enabled: !!id,
  });

  const [showSingleForm, setShowSingleForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);

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
                  Use (csv/json) file to upload multiple content items at once.
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
            <CollectionContent />
          </div>
        </div>
      )}
    </div>
  );
}
