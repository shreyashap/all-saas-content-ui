import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContentByCollectionId } from "../../../api/collection-api";
import { deleteContent, deleteManyContents } from "../../../api/content-api";
import {
  Clock,
  Trash2,
  BookText,
  Globe,
  GraduationCap,
  Tags,
  Flag,
  Loader2,
  Filter,
  CircleCheck,
  Hourglass,
  CircleX,
  PauseCircle,
  PlayCircle,
  EditIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "../../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import { useNavigate, useParams } from "react-router-dom";

export interface ContentItem {
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
    syllableCountMap?: { [key: string]: number };
    audioTitle?: string;
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
  lastFlaggedOn?: string;
}

interface ContentApiResponse {
  status: string;
  data: ContentItem[];
  paginationData: {
    total: number;
    limit: number;
    currentPage: number;
    totalPages: number;
  };
  totalSyllableCount: number;
}

// interface ContentCardProps {
//   collectionId: string;
// }

interface ContentQueryParams {
  collectionId: string;
  page: number;
  contentType?: string;
  language?: string;
  tenantId: string;
}

export default function CollectionContent() {
  const { id: collectionId } = useParams();
  // const { pathname } = useLocation();

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [contentIdToDelete, setContentIdToDelete] = useState<string | null>(
    null
  );

  // const [searchTerm, setSearchTerm] = useState("");

  const [selectedContentType, setSelectedContentType] = useState<string | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [multiDeleteContentIds, setMultiDeleteContentIds] = useState<string[]>(
    []
  );

  const [currentSelectedPage, setCurrentSelectedPage] = useState(1);

  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const contentTypes = ["Word", "Sentence", "Text"];
  const languages = [
    { language: "English", value: "en" },
    { language: "Hindi", value: "hi" },
    { language: "Tamil", value: "ta" },
    { language: "Kannada", value: "ka" },
  ];

  const user = localStorage.getItem("user");
  let tenantId;
  if (user) {
    const savedData = JSON.parse(user);
    tenantId = savedData.tenantId;
    if (!tenantId) {
      const id = localStorage.getItem("tenantId");
      tenantId = id;
    }
  }

  const queryParams: ContentQueryParams = {
    collectionId: collectionId as string,
    page: currentSelectedPage,
    tenantId,
  };

  if (selectedContentType) {
    queryParams.contentType = selectedContentType;
  }

  if (selectedLanguage) {
    queryParams.language = selectedLanguage;
  }

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ContentApiResponse, Error>({
    queryKey: [
      "collectionContent",
      collectionId,
      queryParams,
      currentSelectedPage,
    ],
    queryFn: () => getContentByCollectionId(queryParams),
    enabled: !!collectionId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const contents = apiResponse?.data || [];

  const paginationData = apiResponse?.paginationData || {
    total: 0,
    limit: 10,
    currentPage: 1,
    totalPages: 1,
  };

  useEffect(() => {
    const currentAudioElement = audioRef.current;

    const handleAudioEnded = () => {
      setPlayingAudioId(null);
    };

    return () => {
      if (currentAudioElement) {
        currentAudioElement.removeEventListener("ended", handleAudioEnded);
        currentAudioElement.pause();
        currentAudioElement.src = "";
      }
    };
  }, []);

  const handleAudioToggle = useCallback(
    (contentId: string, audioUrl: string) => {
      if (audioRef.current && playingAudioId === contentId) {
        audioRef.current.pause();
        setPlayingAudioId(null);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }

        const newAudio = new Audio(audioUrl);
        newAudio
          .play()
          .then(() => {
            audioRef.current = newAudio;
            setPlayingAudioId(contentId);
          })
          .catch((e) => {
            toast.error("Failed to play audio: " + e.message);
            setPlayingAudioId(null);
          });
      }
    },
    [playingAudioId]
  );

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteContent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "collectionContent",
          collectionId,
          queryParams,
          currentSelectedPage,
        ],
      });
      setContentIdToDelete(null);
      toast.success("Content deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete content.");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await deleteManyContents(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "collectionContent",
          collectionId,
          queryParams,
          currentSelectedPage,
        ],
      });
      setMultiDeleteContentIds([]);
      setIsMultiDelete(false);
      toast.success(
        `${multiDeleteContentIds.length} content items deleted successfully!`
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete content.");
    },
  });

  const handleCheckboxChange = (id: string) => {
    setMultiDeleteContentIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Select all applies to all currently displayed contents
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setMultiDeleteContentIds(contents.map((content) => content._id));
    } else {
      setMultiDeleteContentIds([]);
    }
  };

  const handleMultiDelete = () => {
    if (multiDeleteContentIds.length > 0) {
      bulkDeleteMutation.mutate(multiDeleteContentIds);
    } else {
      toast.info("No content selected for bulk deletion.");
    }
  };

  const isAnyContentSelected = multiDeleteContentIds.length > 0;
  const areAllVisibleContentsSelected =
    contents.length > 0 &&
    multiDeleteContentIds.length === contents.length &&
    contents.every((content) => multiDeleteContentIds.includes(content._id));

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg shadow-inner">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-blue-700 font-semibold text-lg">
          Loading content for collection...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-16 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <p className="font-bold text-red-700 text-lg">
          Oops! Something went wrong.
        </p>
        <p className="text-red-500 text-sm mt-2">
          {error?.message || "Failed to load content."}
        </p>
        <p className="text-red-400 text-xs mt-1">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search and Filter Bar - UI remains, functionality removed */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Search Input */}
        {/* <div className="relative flex-grow w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search content by name or keyword..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // You can still capture input but it won't filter
            readOnly // Make it read-only to indicate functionality is removed
            title="Search functionality is disabled for now."
          />
        </div> */}

        {/* Filter Dropdowns - UI remains, functionality removed */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-colors w-full sm:w-auto"
                title="Filter by Content Type functionality is disabled for now."
              >
                <Filter className="h-4 w-4" />
                {selectedContentType ? selectedContentType : "Content Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Content Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedContentType === null}
                onCheckedChange={() => setSelectedContentType(null)}
              >
                All
              </DropdownMenuCheckboxItem>
              {contentTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedContentType === type}
                  onCheckedChange={() => {
                    setSelectedContentType(type);
                  }}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-colors w-full sm:w-auto"
                title="Filter by Language functionality is disabled for now."
              >
                <Filter className="h-4 w-4" />
                {selectedLanguage
                  ? languages.find((l) => l.value === selectedLanguage)
                      ?.language
                  : "Language"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedLanguage === null}
                onCheckedChange={() => setSelectedLanguage(null)}
              >
                All
              </DropdownMenuCheckboxItem>
              {languages.map((lang) => (
                <DropdownMenuCheckboxItem
                  key={lang.value}
                  checked={selectedLanguage === lang.value}
                  onCheckedChange={() => {
                    setSelectedLanguage(lang.value);
                  }}
                >
                  {lang.language}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Multi-Delete Actions and Collection Info Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex gap-3 w-full sm:w-auto justify-end">
          {isMultiDelete && (
            <>
              {isAnyContentSelected && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      Delete {multiDeleteContentIds.length} Selected
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to{" "}
                        <strong>permanently delete</strong>{" "}
                        {multiDeleteContentIds.length} selected content items?
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={handleMultiDelete}
                        disabled={bulkDeleteMutation.isPending}
                      >
                        {bulkDeleteMutation.isPending ? (
                          <span className="inline-flex items-center gap-2">
                            Deleting{" "}
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </span>
                        ) : (
                          "Delete All Selected"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsMultiDelete(false);
                  setMultiDeleteContentIds([]);
                }}
              >
                Cancel Multi-Select
              </Button>
            </>
          )}
          {!isMultiDelete && (
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => setIsMultiDelete(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Multiple
            </Button>
          )}
        </div>
      </div>

      {/* Content Table Display */}
      {contents.length === 0 && !isLoading ? (
        <div className="w-full text-center py-16 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <p className="font-semibold text-blue-700 text-lg mb-2">
            No content found!
          </p>
          <p className="text-blue-500">
            Looks like this collection is empty or no content matches your
            current search and filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isMultiDelete && (
                      <Input
                        type="checkbox"
                        checked={areAllVisibleContentsSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        title="Select All Visible"
                      />
                    )}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publisher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Text Snippet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Word Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Syllable Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phonemes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Word Freq.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Syllable Map
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flagged
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contents.map((content) => (
                  <tr
                    key={content._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isMultiDelete && (
                        <Input
                          type="checkbox"
                          checked={multiDeleteContentIds.includes(content._id)}
                          onChange={() => handleCheckboxChange(content._id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      )}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {content.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BookText className="w-4 h-4 text-blue-500" />
                        {content.contentType || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4 text-green-600" />
                        {languages.find((l) => l.value === content.language)
                          ?.language ||
                          content.language ||
                          "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {content.publisher && (
                          <GraduationCap className="w-4 h-4 text-purple-600" />
                        )}
                        {content.publisher || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Badge
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          content.status === "live"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : content.status === "draft"
                            ? "bg-gray-100 text-gray-800 border-gray-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {content.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Badge
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          content.reviewStatus === "approved"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : content.reviewStatus === "pending"
                            ? "bg-orange-100 text-orange-800 border-orange-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {content.reviewStatus === "approved" && (
                          <CircleCheck className="w-3 h-3" />
                        )}
                        {content.reviewStatus === "pending" && (
                          <Hourglass className="w-3 h-3" />
                        )}
                        {content.reviewStatus === "rejected" && (
                          <CircleX className="w-3 h-3" />
                        )}
                        {content.reviewStatus.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {content.tags?.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 flex items-center gap-1"
                          >
                            <Tags className="w-3 h-3" /> {tag}
                          </Badge>
                        ))}
                        {content.tags && content.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{content.tags.length - 2} more
                          </span>
                        )}
                        {(!content.tags || content.tags.length === 0) && (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                      title={content.contentSourceData[0]?.text}
                    >
                      {content.contentSourceData[0]?.text || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {content.contentSourceData[0]?.audioUrl ? (
                        <div className="flex flex-col items-start">
                          <button
                            onClick={() =>
                              handleAudioToggle(
                                content._id,
                                content.contentSourceData[0].audioUrl
                              )
                            }
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md"
                            title={
                              playingAudioId === content._id
                                ? `Pause audio: ${
                                    content.contentSourceData[0].audioTitle ||
                                    content.name
                                  }`
                                : `Play audio: ${
                                    content.contentSourceData[0].audioTitle ||
                                    content.name
                                  }`
                            }
                          >
                            {playingAudioId === content._id ? (
                              <PauseCircle className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                            <span className="text-xs font-medium">
                              {content.contentSourceData[0].audioTitle ||
                                "Audio"}
                            </span>
                          </button>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {content.contentSourceData[0]?.wordCount ?? "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {content.contentSourceData[0]?.syllableCount ?? "N/A"}
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis"
                      title={content.contentSourceData[0]?.phonemes?.join(", ")}
                    >
                      {content.contentSourceData[0]?.phonemes?.length > 0
                        ? content.contentSourceData[0].phonemes.join(", ")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {content.contentSourceData[0]?.wordFrequency ? (
                        <Badge
                          variant="outline"
                          className="bg-teal-50 text-teal-700 border-teal-200"
                        >
                          Available
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {content.contentSourceData[0]?.syllableCountMap ? (
                        <Badge
                          variant="outline"
                          className="bg-teal-50 text-teal-700 border-teal-200"
                        >
                          Available
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {new Date(content.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {new Date(content.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {content.flagReasons ? (
                        <div
                          className="flex flex-col items-start gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100 max-w-[200px]"
                          title={
                            `Reasons: ${content.flagReasons}\n` +
                            (content.flaggedBy
                              ? `Flagged By: ${content.flaggedBy}\n`
                              : "") +
                            (content.lastFlaggedOn
                              ? `Last Flagged On: ${new Date(
                                  content.lastFlaggedOn
                                ).toLocaleDateString()} ${new Date(
                                  content.lastFlaggedOn
                                ).toLocaleTimeString()}`
                              : "")
                          }
                        >
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Flag className="w-4 h-4" /> Flagged
                          </span>
                          {content.flaggedBy && (
                            <span className="text-xs text-red-600">
                              By: {content.flaggedBy}
                            </span>
                          )}
                          {content.flagReasons && (
                            <span
                              className="text-xs text-red-600 truncate w-full"
                              title={content.flagReasons}
                            >
                              Reasons: {content.flagReasons}
                            </span>
                          )}
                          {content.lastFlaggedOn && (
                            <span className="text-xs text-red-600">
                              On:{" "}
                              {new Date(
                                content.lastFlaggedOn
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!isMultiDelete && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setContentIdToDelete(content._id)}
                              disabled={
                                deleteContentMutation.isPending &&
                                contentIdToDelete === content._id
                              }
                            >
                              {deleteContentMutation.isPending &&
                              contentIdToDelete === content._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this content
                                item: "<strong>{content.name}</strong>"? This
                                action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setContentIdToDelete(null)}
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  deleteContentMutation.mutate(content._id)
                                }
                                disabled={
                                  deleteContentMutation.isPending &&
                                  contentIdToDelete === content._id
                                }
                              >
                                {deleteContentMutation.isPending &&
                                contentIdToDelete === content._id ? (
                                  <span className="inline-flex items-center gap-2">
                                    Deleting{" "}
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  </span>
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      <Button
                        variant="ghost"
                        className="text-green-300 hover:text-green-400 hover:bg-green-50"
                        onClick={() =>
                          navigate(
                            `/dashboard/content-edit/${content.contentId}`,
                            { state: content }
                          )
                        }
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination UI - UI remains, functionality removed */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              disabled={currentSelectedPage === 1}
              title="Pagination functionality going to previous page"
              onClick={() => setCurrentSelectedPage(currentSelectedPage - 1)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentSelectedPage} of {paginationData.totalPages} (Total:{" "}
              {paginationData.total})
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={paginationData.totalPages === currentSelectedPage}
              title="Pagination functionality going to next page"
              onClick={() => setCurrentSelectedPage(currentSelectedPage + 1)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-whitebg-brand-dark text-white"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
