import { Order } from "./order";
import { Payment } from "./payment";
import { Product } from "./product";
import { User } from "./user";

export type AdminRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminRequest = {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "email" | "phone" | "avatar" | "role">;
  reason: string;
  experience: string;
  whatsapp: string;
  agreed: boolean;
  status: AdminRequestStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboard = {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    paidTransactions: number;
    revenue: number;
    pendingAdminRequests: number;
  };
  latestOrders: Order[];
  lowStockProducts: Product[];
  recentAdminRequests: AdminRequest[];
};

export type AdminTransaction = Payment & {
  order: Order & {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};
