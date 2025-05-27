export interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string | null;
}
