import { Role } from "./Role";

export interface Profile {
  _id: string;
  displayName: string;
  email: string;
  password: string;
  birthDate: string;
  phone: string;
  studentId: string;
  otp: string;
  bio: string;
  avatarUrl: string;
  status: string;
  secretKey: string;
  lastLogin:string;
  role: Role;
}
