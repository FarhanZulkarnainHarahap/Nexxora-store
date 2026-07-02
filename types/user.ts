import { Address } from "./address";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  emailVerifiedAt?: string | null;
  emailVerified?: string | null;
  profileCompleted?: boolean;
  addresses?: Address[];
  role: "USER" | "ADMIN";
};
