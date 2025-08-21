export interface  IComment {
  id?: number;
  propertyId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: Date;
  parentId?: number;
}