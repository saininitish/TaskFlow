import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword: (password: string) => Promise<boolean>;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
