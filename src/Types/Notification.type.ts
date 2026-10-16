export interface NotificationType {
  _id: string;
  type: string;
  message?: string;
  read: boolean;
  createdAt: string;
}
