export interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  purchaseLink: string;
  isShared: boolean;
  claimedBy: string[];
  createdAt: number;
}

export interface GiftFormData {
  name: string;
  description: string;
  imageUrl: string;
  purchaseLink: string;
  isShared: boolean;
}
