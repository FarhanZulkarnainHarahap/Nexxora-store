import { Product } from "./product";

export type MarketplaceProvider = "TOKOPEDIA" | "TIKTOK_SHOP";
export type MarketplaceMode = "MOCK" | "LIVE";

export type MarketplaceAccount = {
  id: string;
  provider: MarketplaceProvider;
  mode: MarketplaceMode;
  shopId: string;
  shopName: string;
  sellerId?: string | null;
  fsId?: string | null;
  isActive: boolean;
  lastSyncedAt?: string | null;
};

export type MarketplaceStatus = {
  mode: MarketplaceMode;
  accounts: MarketplaceAccount[];
  metrics: {
    totalProducts: number;
    linkedProducts: number;
    totalOrders: number;
    importedOrders: number;
    failedSyncs: number;
    webhookEvents: number;
  };
};

export type MarketplaceProduct = {
  id: string;
  provider: MarketplaceProvider;
  marketplaceProductId: string;
  marketplaceSku?: string | null;
  name: string;
  price: number;
  stock: number;
  status: string;
  imageUrl?: string | null;
  lastSyncedAt?: string | null;
  localProductId?: string | null;
  localProduct?: Product | null;
};

export type MarketplaceOrderItem = {
  id: string;
  productName: string;
  sku?: string | null;
  quantity: number;
  price: number;
  localProductId?: string | null;
};

export type MarketplaceOrder = {
  id: string;
  provider: MarketplaceProvider;
  marketplaceOrderId: string;
  invoiceNumber?: string | null;
  buyerName?: string | null;
  totalAmount: number;
  orderStatus: string;
  paymentStatus?: string | null;
  shippingStatus?: string | null;
  orderedAt?: string | null;
  localOrderId?: string | null;
  items: MarketplaceOrderItem[];
};

export type MarketplaceSyncLog = {
  id: string;
  provider: MarketplaceProvider;
  action: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  message?: string | null;
  startedAt: string;
  finishedAt?: string | null;
};

export type MarketplaceWebhookEvent = {
  id: string;
  provider: MarketplaceProvider;
  eventType: string;
  eventId?: string | null;
  status: "RECEIVED" | "PROCESSED" | "FAILED" | "IGNORED";
  payload: Record<string, unknown>;
  processedAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
