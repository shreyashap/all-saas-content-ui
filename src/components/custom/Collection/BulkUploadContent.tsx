import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadBulkContent } from "../../../api/content-api";
import { toast } from "sonner";

export default function BulkUploadForm({
  collectionId,
  onCreated,
}: {
  collectionId: string;
  onCreated: () => void;
}) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File) => {
    const allowedTypes = ["application/json", "text/csv"];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only .csv or .json files are allowed.");
        return false;
      } else {
        setError("");
        return true;
      }
    }
  };

  const bulkUploadContentMutation = useMutation({
    mutationFn: async (FormData: FormData) => {
      await uploadBulkContent(FormData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collectionContent", collectionId],
      });
      toast.success("Content uploaded for review");
      onCreated();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to upload content.");
    },
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("collectionId", collectionId);

    bulkUploadContentMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (!validateFile(selectedFile as File)) return;
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <Input
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full bg-brand hover:bg-brand-dark">
        {bulkUploadContentMutation.isPending ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}
