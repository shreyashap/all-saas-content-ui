import { useQuery } from "@tanstack/react-query";
import { getContentByCollectionId } from "../../../api/collection-api";
import { Clock, ClockFading, Trash2 } from "lucide-react";

interface ContentItem {
  _id: string;
  collectionId: string;
  name: string;
  contentType: string;
  contentSourceData: {
    language: string;
    text: string;
    audioUrl: string;
    phonemes: string[];
    wordCount: number;
    wordFrequency: { [key: string]: number };
    syllableCount: number;
    syllableCountMap: { [key: string]: number };
  }[];
  imagePath: string;
  reviewStatus: string;
  status: string;
  publisher: string;
  language: string;
  contentIndex: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  contentId: string;
  flagReasons?: string;
  flaggedBy?: string;
}

function ContentCard({ collectionId }: { collectionId: string }) {
  // Use useQuery to fetch content data
  const {
    data: contents,
    isLoading,
    isError,
    error,
  } = useQuery<ContentItem[], Error>({
    queryKey: ["collectionContent", collectionId],
    queryFn: () => getContentByCollectionId(collectionId),
    enabled: !!collectionId,
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
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
        <p className="ml-3 text-indigo-600 font-medium">Loading content...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-10 text-red-600">
        <p className="font-medium">Error loading content:</p>
        <p className="text-sm">{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="w-full text-center py-10 text-gray-500">
        <p>No content available for this collection yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {contents.map((content: ContentItem) => (
        <div
          key={content._id}
          className="bg-blue-50 rounded shadow p-4 border border-gray-200 w-full mb-4"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{content.name}</h3>
              <p className="text-sm text-gray-500">
                Type: {content.contentType}
              </p>
              <p className="text-sm text-gray-500">
                Language: {content.language}
              </p>
            </div>
            <div className="w-full justify-center md:justify-end my-6 flex flex-wrap gap-2 items-center border-gray-200">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  content.reviewStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {content.reviewStatus}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  content.status === "live"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {content.status}
              </span>
              {content.publisher && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Publisher: {content.publisher}
                </span>
              )}
              {content.tags && content.tags.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Tags: {content.tags.join(", ")}
                </span>
              )}
            </div>
          </div>

          {content.contentSourceData &&
            content.contentSourceData.length > 0 && (
              <div className="mt-2 text-sm text-gray-700 border-t py-3 border-gray-300">
                <p className="font-semibold">Text:</p>
                <p className="italic">"{content.contentSourceData[0].text}"</p>
                <p>Word Count: {content.contentSourceData[0].wordCount}</p>
                <p>
                  Syllable Count: {content.contentSourceData[0].syllableCount}
                </p>
                {/* You can add more details here from contentSourceData */}
                {/* For example, phonemes, wordFrequency, syllableCount etc. */}
              </div>
            )}

          {content.flagReasons && (
            <p className="mt-2 text-red-500 text-sm">
              🚩 Previously flagged: {content.flagReasons}
              {content.flaggedBy && ` by ${content.flaggedBy}`}
            </p>
          )}

          <div className="flex justify-between items-center border-t pt-2 border-gray-300">
            <div>
              <p className="text-xs text-gray-400 mt-2 flex gap-2 items-center justify-end mb-2 text-left">
                Created At : {new Date(content.createdAt).toLocaleDateString()}{" "}
                <Clock className="w-4 h-4 text-blue-500" />
              </p>
              <p className="text-xs text-gray-400 flex gap-2 items-center justify-end">
                Last Updated: {new Date(content.updatedAt).toLocaleDateString()}{" "}
                <ClockFading className="w-4 h-4 text-blue-500" />
              </p>
            </div>
            <div>
              <Trash2 className="w-5 h-5 text-red-400 hover:text-red-500 cursor-pointer order-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContentCard;
