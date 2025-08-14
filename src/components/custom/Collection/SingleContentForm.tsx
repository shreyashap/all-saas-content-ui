import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contentSchema,
  type ContentFormType,
  type ExtendedContentFormType,
} from "../../../zod-schemas/SingleContentSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContent } from "../../../api/content-api";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function SingleContentForm({
  collectionId,
  onCreated,
}: {
  collectionId: string;
  onCreated: () => void;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContentFormType>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      collectionId,
      name: "",
      contentType: "Text",
      contentSourceData: [
        {
          language: "en",
          audioUrl: "",
          text: "",
        },
      ],
      publisher: "ekstep",
      language: "en",
      tags: [],
    },
  });
  const { fields, append, remove } = useFieldArray<
    ContentFormType,
    "tags",
    "id"
  >({
    name: "tags",
    control,
    keyName: "id",
  });

  const [tag, setTag] = useState("");

  const handleAddTag = () => {
    if (tag.trim() !== "") {
      append({ value: tag.trim() });
      setTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    remove(index);
  };

  const createContentMutation = useMutation({
    mutationFn: async (data: ExtendedContentFormType) => {
      await createContent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collectionContent", collectionId],
      });
      toast.success("Content uploaded for review");
      onCreated();
      reset();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create content.");
    },
  });

  const onSubmit = async (data: ContentFormType) => {
    // const dataToSend = {
    //   ...data,
    //   tags: data.tags?.map((tag) => tag.value),
    // };

    const user = localStorage.getItem("user");

    if (user) {
      const userInfo = JSON.parse(user);
      const id = userInfo.tenantId;
      if (!id) {
        const tenantId = localStorage.getItem("tenantId") as string;
        createContentMutation.mutate({ tenantId, ...data });
      } else {
        createContentMutation.mutate({ tenantId: id, ...data });
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="my-2">
            Name
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter content name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Content Type */}
        <div>
          <Label htmlFor="contentType" className="my-2">
            Content Type
          </Label>
          <Input
            id="contentType"
            {...register("contentType")}
            placeholder="e.g. Sentence"
          />
          {errors.contentType && (
            <p className="text-sm text-red-500">{errors.contentType.message}</p>
          )}
        </div>

        {/* Text */}
        <div>
          <Label htmlFor="text" className="my-2">
            Text
          </Label>
          <Textarea
            id="text"
            {...register("contentSourceData.0.text")}
            placeholder="Blue bird, blue bird, what do you see?"
          />
          {errors.contentSourceData?.[0]?.text && (
            <p className="text-sm text-red-500">
              {errors.contentSourceData[0].text?.message}
            </p>
          )}
        </div>

        {/* Language */}
        <div>
          <Label htmlFor="language" className="my-2">
            Language
          </Label>
          <Input
            id="language"
            {...register("contentSourceData.0.language")}
            placeholder="e.g. en"
          />
          {errors.contentSourceData?.[0]?.language && (
            <p className="text-sm text-red-500">
              {errors.contentSourceData[0].language?.message}
            </p>
          )}
        </div>

        {/* Audio URL */}
        <div>
          <Label htmlFor="audioUrl" className="my-2">
            Audio URL (optional)
          </Label>
          <Input
            id="audioUrl"
            {...register("contentSourceData.0.audioUrl")}
            placeholder="https://example.com/audio.mp3"
          />
        </div>
        <div>
          <Label htmlFor="tagInput" className="mb-2">
            Tags
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="tagInput"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Add a tag and press '+' or Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Plus
              className="bg-blue-400 text-white hover:bg-blue-600 rounded-full w-9 h-9 p-2 cursor-pointer"
              onClick={handleAddTag}
            />
          </div>
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <div className="flex items-center gap-2" key={field.id}>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {field.value}{" "}
              </span>
              <X
                className="w-4 h-4 text-red-500 cursor-pointer"
                onClick={() => handleRemoveTag(index)}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-brand hover:bg-brand-dark"
          disabled={createContentMutation.isPending}
        >
          {createContentMutation.isPending ? "Submitting..." : "Add Content"}
        </Button>
      </form>
    </div>
  );
}
