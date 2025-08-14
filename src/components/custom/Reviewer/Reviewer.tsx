import { toast } from "sonner";
import { Button } from "../../ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getReviewerContent, reviewContent } from "../../../api/reviewer-api";
import { FlagDialog } from "./FlagDialog";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookText,
  CircleCheck,
  CircleX,
  Clock,
  Flag,
  Globe,
  GraduationCap,
  Hourglass,
  PauseCircle,
  PlayCircle,
  Tags,
} from "lucide-react";
import { type ContentItem } from "../Author/CollectionContent";
import { Badge } from "@/components/ui/badge";

type ReviewPayload = {
  contentId: string;
  reviewStatus: string;
  reviewer: string;
  flagReasons?: string;
};

export default function ReviewerDashboard() {
  // const queryClient = useQueryClient();

  const [refreshIndex, setRefreshIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

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

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["reviewer", refreshIndex],
    queryFn: getReviewerContent,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const reviewContentMutation = useMutation({
    mutationFn: async (payload: ReviewPayload) => {
      const { contentId, reviewStatus, reviewer, flagReasons } = payload;
      await reviewContent(contentId, reviewStatus, reviewer, flagReasons);
    },
    onSuccess: () => {
      toast.success(`Content reviewed`);
      setRefreshIndex((prev) => prev + 1);
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to update the review.");
    },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold my-4 ml-2">Review Content</h1>
      {contents.length === 0 && !isLoading ? (
        <div className="w-full text-center py-16 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <p className="font-semibold text-blue-700 text-lg mb-2">
            No content found!
          </p>
          <p className="text-blue-500">
            Looks like there is no content available for review
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                {contents.map((content: ContentItem) => (
                  <tr
                    key={content._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                        {content.language || "N/A"}
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
                        <div className="flex flex-col items-start gap-1 min-w-[150px]">
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
                      <div className="flex gap-2 mt-3">
                        {" "}
                        {/* Reduced margin */}
                        <Button
                          className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 text-sm"
                          onClick={() =>
                            reviewContentMutation.mutate({
                              contentId: content.contentId,
                              reviewStatus: "approved",
                              reviewer: "reviewer@example.com",
                            })
                          }
                        >
                          Approve
                        </Button>
                        <FlagDialog
                          onFlag={(reason) =>
                            reviewContentMutation.mutate({
                              contentId: content.contentId,
                              reviewStatus: "flagged",
                              reviewer: "reviewer@example.com",
                              flagReasons: reason,
                            })
                          }
                        />
                      </div>
                      ;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


