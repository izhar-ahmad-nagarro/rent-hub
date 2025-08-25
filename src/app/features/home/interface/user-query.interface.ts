export interface IUserQuery {
  id?: number;
  propertyId: number;
  userId: number;
  userName: string;
  email: string;
  message: string;
  createdAt: number;
  replies: IReply[];
  replyText?: string;
}

export interface IReply {
  message: string;
  createdAt: number;
}
