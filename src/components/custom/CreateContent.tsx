import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export const UploadContentForm = ({
  collectionId,
}: {
  collectionId: string;
}) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ collectionId, title, type, file });
  };

  return (
    <Card className="p-6 mt-8 shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-[#3730A3]">
        📤 Upload Content
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            className="mt-1"
            placeholder="e.g., Intro to Regression"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>File</Label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <Button
          className="bg-[#6366f1] text-white hover:bg-[#3730A3]"
          type="submit"
        >
          Upload Content
        </Button>
      </form>
    </Card>
  );
};
