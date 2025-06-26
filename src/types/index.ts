export type Collection = {
  id: string;
  name: string;
  description: string;
};

export type Content = {
  id: string;
  title: string;
  type: "video" | "pdf" | "text";
  file?: File;
  collectionId: string;
};

export interface CreateCollectionType {
  title: string;
  name: string;
  description: string;
  category: string;
  author: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  status: string;
  tags: string[] | undefined;
}
