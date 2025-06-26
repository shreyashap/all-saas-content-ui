import { Button } from "../ui/button";
import { Eye, Edit2, Trash2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  status: string;
  langauge: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const CollectionCard = ({
  title,
  description,
  status,
  langauge,
  onView,
  onEdit,
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
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={onView}>
        <Eye className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onEdit}>
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
