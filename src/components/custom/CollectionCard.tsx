import { Button } from "../ui/button";
import {
  BookText,
  ClockFadingIcon,
  Eye,
  GraduationCap,
  Trash2,
} from "lucide-react";

type Props = {
  title: string;
  description: string;
  status: string;
  langauge: string;
  author: string;
  category: string;
  createdAt: string;
  onView: () => void;
  onDelete: () => void;
};

export const CollectionCard = ({
  title,
  description,
  status,
  langauge,
  author,
  category,
  createdAt,
  onView,
  onDelete,
}: Props) => (
  <div className="bg-white rounded-lg shadow hover:shadow-md transition p-6 flex flex-col justify-between border border-gray-200 lg:mb-4">
    <div>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800 flex justify-between">
          <span>{title}</span>
        </h4>
        <div className="flex justify-between items-center gap-2">
          <p className="bg-yellow-100 text-yellow-500 px-3 py-0.5 rounded-full text-sm">
            {status}
          </p>
          <p className="bg-blue-100 text-blue-500 px-3 py-0.5 rounded-full text-sm">
            {langauge}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
    <div className="flex flex-col justify-start gap-2 mt-4">
      <div className=" inline-flex gap-2">
        <GraduationCap className="bg-yellow-50 text-yellow-500 p-1 rounded text-xl" />
        <span>
          <strong>Author : </strong>
          {author}
        </span>
      </div>
      <div className=" inline-flex gap-2">
        <BookText className="text-blue-500 bg-blue-50 p-1 rounded text-xl" />
        <span>
          <strong>Category : </strong>
          {category}
        </span>
      </div>

      <div className=" inline-flex gap-2">
        <ClockFadingIcon className="text-green-500 bg-green-50 p-1 rounded text-xl" />
        <span>
          <strong>Created At : </strong>
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={onView}>
        <Eye className="w-4 h-4" />
      </Button>
      {/* <Button variant="secondary" size="sm" onClick={onEdit}>
        <Edit2 className="w-4 h-4" />
      </Button> */}
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
