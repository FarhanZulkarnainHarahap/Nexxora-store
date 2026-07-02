import { authFetch } from "./api";
import {
  MarketplaceAccount,
  MarketplaceOrder,
  MarketplaceProduct,
  MarketplaceProvider,
  MarketplaceStatus,
  MarketplaceSyncLog,
  MarketplaceWebhookEvent,
  Paginated,
} from "@/types/marketplace";

function providerPath(provider: MarketplaceProvider) {
  return provider.toLowerCase().replace("_", "-");
}

export function getMarketplaceStatus() {
  return authFetch<MarketplaceStatus>("/marketplace/status");
}

export function getMarketplaceAccounts() {
  return authFetch<MarketplaceAccount[]>("/marketplace/accounts");
}

export function connectMarketplace(provider: MarketplaceProvider) {
  return authFetch<MarketplaceAccount>(
    `/marketplace/${providerPath(provider)}/connect`,
    { method: "POST" },
  );
}

export function disconnectMarketplace(provider: MarketplaceProvider) {
  return authFetch<{ provider: MarketplaceProvider; isActive: boolean }>(
    `/marketplace/${providerPath(provider)}/disconnect`,
    { method: "POST" },
  );
}

export function testMarketplaceConnection(provider: MarketplaceProvider) {
  return authFetch<{
    provider: MarketplaceProvider;
    mode: "MOCK" | "LIVE";
    connected: boolean;
    message: string;
  }>(`/marketplace/${providerPath(provider)}/test-connection`);
}

export function getMarketplaceShop(provider: MarketplaceProvider) {
  return authFetch<{
    provider: MarketplaceProvider;
    shopId: string;
    shopName: string;
    sellerId?: string;
    fsId?: string;
  }>(`/marketplace/${providerPath(provider)}/shop`);
}

export function syncMarketplaceProducts(provider: MarketplaceProvider) {
  return authFetch<{ synced: number }>(
    `/marketplace/${providerPath(provider)}/products/sync`,
    { method: "POST" },
  );
}

export function getMarketplaceProducts(provider: MarketplaceProvider) {
  return authFetch<Paginated<MarketplaceProduct>>(
    `/marketplace/${providerPath(provider)}/products?limit=100`,
  );
}

export function linkMarketplaceProduct(
  provider: MarketplaceProvider,
  id: string,
  localProductId: string,
) {
  return authFetch<MarketplaceProduct>(
    `/marketplace/${providerPath(provider)}/products/${id}/link-local-product`,
    { method: "POST", body: JSON.stringify({ localProductId }) },
  );
}

export function syncMarketplaceStock(provider: MarketplaceProvider, id: string) {
  return authFetch<MarketplaceProduct>(
    `/marketplace/${providerPath(provider)}/products/${id}/sync-stock`,
    { method: "PATCH" },
  );
}

export function syncMarketplacePrice(provider: MarketplaceProvider, id: string) {
  return authFetch<MarketplaceProduct>(
    `/marketplace/${providerPath(provider)}/products/${id}/sync-price`,
    { method: "PATCH" },
  );
}

export function syncMarketplaceOrders(provider: MarketplaceProvider) {
  return authFetch<{ synced: number }>(
    `/marketplace/${providerPath(provider)}/orders/sync`,
    { method: "POST" },
  );
}

export function getMarketplaceOrders(provider: MarketplaceProvider) {
  return authFetch<Paginated<MarketplaceOrder>>(
    `/marketplace/${providerPath(provider)}/orders?limit=100`,
  );
}

export function importMarketplaceOrder(
  provider: MarketplaceProvider,
  id: string,
) {
  return authFetch<{ localOrderId: string; duplicate: boolean }>(
    `/marketplace/${providerPath(provider)}/orders/${id}/import`,
    { method: "POST" },
  );
}

export function getMarketplaceSyncLogs() {
  return authFetch<Paginated<MarketplaceSyncLog>>(
    "/marketplace/sync-logs?limit=100",
  );
}

export function getMarketplaceWebhookEvents() {
  return authFetch<Paginated<MarketplaceWebhookEvent>>(
    "/marketplace/webhook-events?limit=100",
  );
}
