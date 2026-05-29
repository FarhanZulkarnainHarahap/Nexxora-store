import { Address } from "./address";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  emailVerifiedAt?: string | null;
  addresses?: Address[];
  role: "USER" | "ADMIN";
};
