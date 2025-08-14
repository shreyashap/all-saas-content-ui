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
  tenantId: string;
}

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
