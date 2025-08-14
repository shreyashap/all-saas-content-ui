import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";
import { Plus, X } from "lucide-react";
// import api from "../../api";
// import { toast } from "sonner";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateCollectionSchmea,
  createCollectionSchema,
} from "../../zod-schemas/CreateCollectionSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCollectionType } from "../../types";
import { createCollection } from "@/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLocation } from "react-router";

export const CreateCollectionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    // getValues is still useful, but `fields[index].value` will now work directly
  } = useForm<CreateCollectionSchmea>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      title: "",
      name: "",
      description: "",
      category: "",
      author: "",
      difficulty: "Easy",
      language: "",
      status: "",
      tags: [],
    },
  });

  // type TagItem = {
  //   value: string;
  //   id: string;
  // };

  const location = useLocation();

  const { fields, append, remove } = useFieldArray<
    CreateCollectionSchmea,
    "tags",
    "id"
  >({
    name: "tags",
    control,
    keyName: "id",
  });

  const [tagInput, setTagInput] = useState<string>("");
  const queryClient = useQueryClient();

  const createCollectionMutation = useMutation({
    mutationFn: async (newCollectionData: CreateCollectionType) => {
      await createCollection(newCollectionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created successfully");
      reset();
      setTagInput("");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create collection.");
    },
  });

  const onSubmit: SubmitHandler<CreateCollectionSchmea> = async (data) => {
    const dataToSend = {
      ...data,
      tags: data.tags?.map((tag) => tag.value),
    };

    const user = localStorage.getItem("user");
    if (user) {
      const userInfo = JSON.parse(user);
      const tenantId = userInfo.tenantId;
      if (!tenantId) {
        const id = location.pathname.split("/").pop();
        createCollectionMutation.mutate({ tenantId:id as string, ...dataToSend });
      }else{
        createCollectionMutation.mutate({ tenantId, ...dataToSend });
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      append({ value: tagInput.trim() });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    remove(index);
  };

  return (
    <>
      <div className="font-sans mt-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700 text-md md:text-lg">
                Create New Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="mb-2">
                      Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Story 1 - kannada"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="name" className="mb-2">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Teacher-Teacher"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description" className="mb-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description..."
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category" className="mb-2">
                      Category
                    </Label>
                    <Input
                      id="category"
                      type="text"
                      placeholder="Category"
                      {...register("category")}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="author" className="mb-2">
                      Author
                    </Label>
                    <Input
                      id="author"
                      type="text"
                      placeholder="Author"
                      {...register("author")}
                    />
                    {errors.author && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.author.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="difficulty" className="mb-2">
                      Difficulty
                    </Label>
                    <Input
                      id="difficulty"
                      type="text"
                      placeholder="Medium"
                      {...register("difficulty")}
                    />
                    {errors.difficulty && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.difficulty.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="language" className="mb-2">
                      Language
                    </Label>
                    <Input
                      id="language"
                      type="text"
                      placeholder="e.g - en"
                      {...register("language")}
                    />
                    {errors.language && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.language.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status" className="mb-2">
                      Status
                    </Label>
                    <Input
                      id="status"
                      type="text"
                      placeholder="Status"
                      {...register("status")}
                    />
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>

                  {/* Tag Input Section */}
                  <div>
                    <Label htmlFor="tagInput" className="mb-2">
                      Tags
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="tagInput"
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tags.message}
                      </p>
                    )}
                  </div>

                  {/* Displaying Added Tags */}
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
                    disabled={createCollectionMutation.isPending}
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {createCollectionMutation.isPending
                      ? "Creating..."
                      : "Create Collection"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
