import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useMemo, useCallback, useState } from "react"; // Added useState for new tag input
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  BookText,
  Loader2,
  Save,
  XCircle,
  Flag,
  ArrowLeft,
  Plus,
} from "lucide-react";

import { type ContentItem } from "../types";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { updateContent } from "../api/content-api";

type FormData = {
  name: string;
  contentType: string;
  language: string;
  contentSourceData_text: string;
  contentSourceData_audioUrl: string;
  tags: string[];
  flagReasons: string;
  flaggedBy: string;
  lastFlaggedOn: string;
};

const contentTypesOptions = ["Word", "Sentence", "Text"];
const languagesOptions = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Tamil", value: "ta" },
  { label: "Kannada", value: "kn" },
];

export default function EditContentPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const contentFromState = location.state;

  const content = contentFromState;

  const [newTagInput, setNewTagInput] = useState<string>("");

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: useMemo(() => {
      if (content) {
        return {
          name: content.name,
          contentType: content.contentType,
          language: content.language,
          contentSourceData_text: content.contentSourceData[0]?.text || "",
          contentSourceData_audioUrl:
            content.contentSourceData[0]?.audioUrl || "",
          tags: content.tags || [],
          flagReasons: content.flagReasons || "",
          flaggedBy: content.flaggedBy || "",
          lastFlaggedOn: content.lastFlaggedOn
            ? new Date(content.lastFlaggedOn).toISOString().split("T")[0]
            : "N/A",
        };
      }
      return { tags: [] };
    }, [content]),
  });

  useEffect(() => {
    if (content) {
      reset(
        {
          name: content.name || "",
          contentType: content.contentType || "",
          language: content.language || "",
          contentSourceData_text: content.contentSourceData[0]?.text || "",
          contentSourceData_audioUrl:
            content.contentSourceData[0]?.audioUrl || "",
          tags: content.tags || [],
          flagReasons: content.flagReasons || "",
          flaggedBy: content.flaggedBy || "",
          lastFlaggedOn: content.lastFlaggedOn
            ? new Date(content.lastFlaggedOn).toISOString().split("T")[0]
            : "",
        },
        { keepDirty: false }
      );
    }
  }, [content, reset]);

  const updateContentMutation = useMutation({
    mutationFn: async (data: Partial<ContentItem>) => {
      if (!contentId) throw new Error("Content ID is missing for update.");
      return updateContent(content._id, data);
    },
    onSuccess: () => {
      toast.success("Content updated successfully!");
      // navigate(-1);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update content.");
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const updatedContent: Partial<ContentItem> = {
      name: data.name,
      contentType: data.contentType,
      language: data.language,
      tags: data.tags.map((tag) => tag.trim()).filter(Boolean),
      contentSourceData: [
        {
          ...(content?.contentSourceData[0] || {}),
          text: data.contentSourceData_text,
          audioUrl: data.contentSourceData_audioUrl,
          language: data.language,
        },
      ],
      flagReasons: data.flagReasons,
      flaggedBy: data.flaggedBy,
      lastFlaggedOn: data.lastFlaggedOn
        ? new Date(data.lastFlaggedOn).toISOString()
        : undefined,
    };
    updateContentMutation.mutate(updatedContent);
  };

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleAddTag = () => {
    if (newTagInput.trim() !== "") {
      const currentTags = getValues("tags") || [];
      const tagToAdd = newTagInput.trim();
      if (
        !currentTags.some((tag) => tag.toLowerCase() === tagToAdd.toLowerCase())
      ) {
        setValue("tags", [...currentTags, tagToAdd], { shouldDirty: true });
        setNewTagInput("");
      } else {
        toast.info("This tag already exists.");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues("tags") || [];
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true }
    );
  };

  if (!content?.contentId || content?.contentId !== contentId) {
    return (
      <div className="w-full h-screen text-center py-16 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <p className="font-bold text-red-700 text-lg">Oops! Page Not Found</p>
        <p className="text-red-500 text-sm mt-2">
          {"Failed to load content for editing."}
        </p>
        <Button
          onClick={handleCancel}
          className="mx-auto mt-4 flex justify-center items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back to Content List
        </Button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg shadow-inner">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-blue-700 font-semibold text-lg">
          Loading content for editing...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm xs:max-w-xl md:max-w-2xl lg:max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200 my-8">
      <div className="flex items-center justify-between mb-6 lg:max-w-6xl mx-auto">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BookText className="w-8 h-8 text-indigo-600" />
          Edit Content :
          <span className="text-indigo-700 mr-4">{content.name}</span>
        </h2>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          <span className="hidden md:inline">Back to Content List</span>
        </Button>
      </div>
      <p className="text-gray-600 mb-8 max-w-6xl mx-auto">
        Content ID: <span className="font-semibold">{content.contentId}</span>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-6xl mx-auto"
      >
        {/* Basic Details */}
        <div className="border-gray-200 border my-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Content Name is required" }}
              render={({ field }) => (
                <Input
                  id="name"
                  {...field}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="contentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content Type
            </label>
            <Controller
              name="contentType"
              control={control}
              rules={{ required: "Content Type is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select a content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypesOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.contentType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contentType.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <Controller
              name="language"
              control={control}
              rules={{ required: "Language is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languagesOptions.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language && (
              <p className="mt-1 text-sm text-red-600">
                {errors.language.message}
              </p>
            )}
          </div>
        </div>

        {/* Tags - Modified Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <>
                  {/* Display existing tags as badges */}
                  {field.value &&
                    field.value.map((tag, index) => (
                      <Badge
                        key={tag + index} // Use tag and index for a unique key
                        variant="secondary"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 -mr-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-200 focus:text-indigo-500"
                        >
                          <XCircle className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </>
              )}
            />
          </div>
          {/* Input for adding new tags */}
          <div className="flex gap-2">
            <Input
              id="newTagInput"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  handleAddTag();
                }
              }}
              placeholder="Add a new tag and press Enter"
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              className="flex-shrink-0 bg-brand hover:bg-brand-dark"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Tag
            </Button>
          </div>
        </div>

        {/* Content Source Data */}
        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
          Content Source Details
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="contentSourceData_text"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Text Content
            </label>
            <Controller
              name="contentSourceData_text"
              control={control}
              rules={{ required: "Text Content is required" }}
              render={({ field }) => (
                <Textarea
                  id="contentSourceData_text"
                  {...field}
                  rows={5}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            />
            {errors.contentSourceData_text && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contentSourceData_text.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contentSourceData_audioUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Audio URL
            </label>
            <Controller
              name="contentSourceData_audioUrl"
              control={control}
              render={({ field }) => (
                <Input
                  id="contentSourceData_audioUrl"
                  {...field}
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            />
          </div>
        </div>

        <div className="border-gray-200 border mt-4"></div>
        {/* Flagging Information */}
        {content.flagReasons && (
          <>
            <h3 className="text-xl font-semibold text-red-400 mt-2 mb-4 inline-flex items-center gap-2">
              Flagging Information <Flag className="w-4 h-4 text-red-400" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>
                  <strong>Flag Reasons : </strong>
                  {content.flagReasons}
                </p>
              </div>
              <div>
                <p>
                  <strong>Flagged By : </strong>
                  {content.flaggedBy || "N/A"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Last Flagged On : </strong>
                  {new Date(content.lastFlaggedOn).toLocaleDateString()}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" /> Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateContentMutation.isPending || !isDirty}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {updateContentMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {updateContentMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
