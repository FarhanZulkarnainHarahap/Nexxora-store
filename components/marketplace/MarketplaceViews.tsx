"use client";

import Link from "next/link";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  FiActivity,
  FiCheckCircle,
  FiDatabase,
  FiLink,
  FiPackage,
  FiRefreshCw,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiXCircle,
  FiRadio,
} from "react-icons/fi";
import toast from "react-hot-toast";
import PageWrapper from "@/components/ui/PageWrapper";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice, formatDate } from "@/lib/format";
import { getProducts } from "@/lib/api";
import {
  connectMarketplace,
  disconnectMarketplace,
  getMarketplaceAccounts,
  getMarketplaceOrders,
  getMarketplaceProducts,
  getMarketplaceStatus,
  getMarketplaceSyncLogs,
  getMarketplaceWebhookEvents,
  getMarketplaceShop,
  importMarketplaceOrder,
  linkMarketplaceProduct,
  syncMarketplaceOrders,
  syncMarketplacePrice,
  syncMarketplaceProducts,
  syncMarketplaceStock,
  testMarketplaceConnection,
} from "@/lib/marketplace";
import {
  MarketplaceAccount,
  MarketplaceOrder,
  MarketplaceProduct,
  MarketplaceProvider,
  MarketplaceStatus,
  MarketplaceSyncLog,
  MarketplaceWebhookEvent,
} from "@/types/marketplace";
import { Product } from "@/types/product";

const providers: MarketplaceProvider[] = ["TOKOPEDIA", "TIKTOK_SHOP"];

function providerLabel(provider: MarketplaceProvider) {
  return provider === "TOKOPEDIA" ? "Tokopedia" : "TikTok Shop";
}

function date(value?: string | null) {
  return value ? formatDate(value) : "—";
}

function StateBadge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" | "red" | "blue" }) {
  const colors = {
    gold: "border-gold/30 bg-gold/10 text-gold",
    green: "border-green-500/30 bg-green-500/10 text-green-400",
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>;
}

function ErpHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">ERP Marketplace</p>
        <h1 className="mt-2 text-3xl font-black text-navy">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ErrorPanel({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
      <p className="font-bold">Unable to load marketplace data</p>
      <p className="mt-1 text-sm">{message}</p>
      {retry ? <button onClick={retry} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Try again</button> : null}
    </div>
  );
}

function TableShell({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">{children}</div>;
}

const buttonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-navy px-4 text-sm font-bold text-white transition hover:bg-slateBlue disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-gold/50 hover:text-gold disabled:opacity-50";

export function MarketplaceOverviewView() {
  const [data, setData] = useState<MarketplaceStatus | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setError("");
      setData(await getMarketplaceStatus());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Request failed");
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  if (error) return <PageWrapper className="p-8"><ErrorPanel message={error} retry={load} /></PageWrapper>;
  if (!data) return <Loading />;

  const metrics = [
    ["Marketplace products", data.metrics.totalProducts, FiShoppingBag],
    ["Linked products", data.metrics.linkedProducts, FiLink],
    ["Marketplace orders", data.metrics.totalOrders, FiShoppingCart],
    ["Imported orders", data.metrics.importedOrders, FiPackage],
    ["Failed syncs", data.metrics.failedSyncs, FiActivity],
    ["Webhook events", data.metrics.webhookEvents, FiRadio],
  ] as const;

  return (
    <PageWrapper className="mx-auto max-w-7xl p-6 lg:p-10">
      <ErpHeader
        title="Marketplace overview"
        description="Connection health and sync coverage across marketplace channels."
        action={<StateBadge tone={data.mode === "MOCK" ? "gold" : "green"}>{data.mode} MODE</StateBadge>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {providers.map((provider) => {
          const account = data.accounts.find((item) => item.provider === provider);
          return (
            <Link href={`/admin/erp/${provider === "TOKOPEDIA" ? "tokopedia" : "tiktok-shop"}`} key={provider} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-navy">{providerLabel(provider)}</h2>
                <StateBadge tone={account?.isActive ? "green" : "red"}>{account?.isActive ? "CONNECTED" : "DISCONNECTED"}</StateBadge>
              </div>
              <p className="mt-4 font-semibold text-slate-700">{account?.shopName ?? "No shop connected"}</p>
              <p className="mt-1 text-sm text-slate-500">Shop ID: {account?.shopId ?? "—"}</p>
              <p className="mt-1 text-sm text-slate-500">Last sync: {date(account?.lastSyncedAt)}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="text-2xl text-gold" />
            <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-black text-navy">{value}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export function MarketplaceProviderView({ provider }: { provider: MarketplaceProvider }) {
  const [account, setAccount] = useState<MarketplaceAccount | null>(null);
  const [shop, setShop] = useState<{ shopId: string; shopName: string; sellerId?: string; fsId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const accounts = await getMarketplaceAccounts();
      const found = accounts.find((item) => item.provider === provider && item.isActive) ?? null;
      setAccount(found);
      if (found) setShop(await getMarketplaceShop(provider));
      else setShop(null);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to load shop");
    } finally {
      setLoading(false);
    }
  }, [provider]);
  useEffect(() => { void load(); }, [load]);

  async function run(label: string, callback: () => Promise<unknown>) {
    try {
      await callback();
      toast.success(label);
      await load();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : `${label} failed`);
    }
  }

  if (loading) return <Loading />;

  return (
    <PageWrapper className="mx-auto max-w-7xl p-6 lg:p-10">
      <ErpHeader title={providerLabel(provider)} description="Connection, shop identity, and channel-specific synchronization." action={<StateBadge tone={account ? "green" : "red"}>{account ? "CONNECTED" : "DISCONNECTED"}</StateBadge>} />
      {!account ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <FiXCircle className="mx-auto text-4xl text-slate-400" />
          <h2 className="mt-4 text-xl font-black text-navy">Connect the mock shop</h2>
          <p className="mt-2 text-slate-500">No partner credentials are needed while MARKETPLACE_MODE=mock.</p>
          <button className={`${buttonClass} mt-6`} onClick={() => run("Marketplace connected", () => connectMarketplace(provider))}>Connect {providerLabel(provider)}</button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Shop</p>
              <h2 className="mt-2 text-2xl font-black text-navy">{shop?.shopName ?? account.shopName}</h2>
              <dl className="mt-5 grid gap-3 text-sm">
                <div><dt className="text-slate-500">Shop ID</dt><dd className="font-bold text-slate-800">{shop?.shopId ?? account.shopId}</dd></div>
                <div><dt className="text-slate-500">Seller ID</dt><dd className="font-bold text-slate-800">{shop?.sellerId ?? account.sellerId ?? "—"}</dd></div>
                <div><dt className="text-slate-500">Last sync</dt><dd className="font-bold text-slate-800">{date(account.lastSyncedAt)}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Operations</p>
              <div className="mt-4 grid gap-3">
                <button className={buttonClass} onClick={() => run("Connection is healthy", () => testMarketplaceConnection(provider))}><FiCheckCircle /> Test connection</button>
                <button className={buttonClass} onClick={() => run("Products synced", () => syncMarketplaceProducts(provider))}><FiRefreshCw /> Sync products</button>
                <button className={buttonClass} onClick={() => run("Orders synced", () => syncMarketplaceOrders(provider))}><FiRefreshCw /> Sync orders</button>
                <button className="min-h-10 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 hover:bg-red-50" onClick={() => run("Marketplace disconnected", () => disconnectMarketplace(provider))}>Disconnect</button>
              </div>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}

async function collectProviderData<T>(loader: (provider: MarketplaceProvider) => Promise<{ items: T[] }>) {
  const results = await Promise.allSettled(providers.map(loader));
  return results.flatMap((result) => result.status === "fulfilled" ? result.value.items : []);
}

export function MarketplaceProductsView() {
  const [items, setItems] = useState<MarketplaceProduct[]>([]);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [marketplace, local] = await Promise.all([collectProviderData(getMarketplaceProducts), getProducts("?limit=100")]);
      setItems(marketplace);
      setLocalProducts(local);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to load products");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function run(callback: () => Promise<unknown>, message: string) {
    try { await callback(); toast.success(message); await load(); }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : "Action failed"); }
  }

  return (
    <PageWrapper className="mx-auto max-w-[1500px] p-6 lg:p-10">
      <ErpHeader title="Marketplace products" description="Link marketplace listings to the Nexxora master catalog, then push stock or price." action={<div className="flex gap-2">{providers.map((provider) => <button key={provider} className={secondaryButtonClass} onClick={() => run(() => syncMarketplaceProducts(provider), `${providerLabel(provider)} products synced`)}><FiRefreshCw />{providerLabel(provider)}</button>)}</div>} />
      {loading ? <Loading /> : !items.length ? <EmptyState icon={FiShoppingBag} title="No marketplace products" description="Connect a marketplace and run product sync." actionLabel="Open ERP overview" href="/admin/erp" /> : (
        <TableShell>
          <table className="min-w-[1450px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Provider","Image","Marketplace Product ID","Product Name","SKU","Marketplace Stock","Nexxora Stock","Marketplace Price","Nexxora Price","Status","Linked Local Product","Last Synced","Action"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-4"><StateBadge>{providerLabel(item.provider)}</StateBadge></td>
                  <td className="px-4 py-4">{item.imageUrl ? <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" /> : "—"}</td>
                  <td className="px-4 py-4 font-mono text-xs">{item.marketplaceProductId}</td>
                  <td className="px-4 py-4 font-bold text-navy">{item.name}</td>
                  <td className="px-4 py-4">{item.marketplaceSku ?? "—"}</td>
                  <td className="px-4 py-4">{item.stock}</td>
                  <td className="px-4 py-4">{item.localProduct?.stock ?? "—"}</td>
                  <td className="px-4 py-4">{formatPrice(item.price)}</td>
                  <td className="px-4 py-4">{item.localProduct ? formatPrice(item.localProduct.price) : "—"}</td>
                  <td className="px-4 py-4"><StateBadge tone="green">{item.status}</StateBadge></td>
                  <td className="px-4 py-4">
                    {item.localProduct ? <span className="font-semibold">{item.localProduct.name}</span> : (
                      <select value={selection[item.id] ?? ""} onChange={(event) => setSelection((current) => ({ ...current, [item.id]: event.target.value }))} className="min-w-44 rounded-lg border border-slate-200 p-2">
                        <option value="">Select local product</option>
                        {localProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-4">{date(item.lastSyncedAt)}</td>
                  <td className="px-4 py-4"><div className="grid gap-2">
                    {!item.localProduct && <button disabled={!selection[item.id]} className={secondaryButtonClass} onClick={() => run(() => linkMarketplaceProduct(item.provider, item.id, selection[item.id]), "Product linked")}><FiLink /> Link</button>}
                    <button disabled={!item.localProduct} className={secondaryButtonClass} onClick={() => run(() => syncMarketplaceStock(item.provider, item.id), "Stock synced")}>Sync stock</button>
                    <button disabled={!item.localProduct} className={secondaryButtonClass} onClick={() => run(() => syncMarketplacePrice(item.provider, item.id), "Price synced")}>Sync price</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </PageWrapper>
  );
}

export function MarketplaceOrdersView() {
  const [items, setItems] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setItems(await collectProviderData(getMarketplaceOrders));
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function importOrder(order: MarketplaceOrder) {
    try { await importMarketplaceOrder(order.provider, order.id); toast.success("Order imported without creating a Xendit payment"); await load(); }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : "Import failed"); }
  }
  async function sync(provider: MarketplaceProvider) {
    try { await syncMarketplaceOrders(provider); toast.success(`${providerLabel(provider)} orders synced`); await load(); }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : "Sync failed"); }
  }
  return (
    <PageWrapper className="mx-auto max-w-[1500px] p-6 lg:p-10">
      <ErpHeader title="Marketplace orders" description="Review persisted channel orders before importing them into Nexxora." action={<div className="flex gap-2">{providers.map((provider) => <button key={provider} className={secondaryButtonClass} onClick={() => sync(provider)}><FiRefreshCw />{providerLabel(provider)}</button>)}</div>} />
      {loading ? <Loading /> : !items.length ? <EmptyState icon={FiShoppingCart} title="No marketplace orders" description="Connect a marketplace and run order sync." actionLabel="Open ERP overview" href="/admin/erp" /> : (
        <TableShell><table className="min-w-[1250px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Provider","Marketplace Order ID","Invoice Number","Buyer","Total","Order Status","Payment Status","Shipping Status","Ordered At","Imported To Nexxora","Action"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{items.map((order) => <tr key={order.id}>
            <td className="px-4 py-4"><StateBadge>{providerLabel(order.provider)}</StateBadge></td><td className="px-4 py-4 font-mono text-xs">{order.marketplaceOrderId}</td><td className="px-4 py-4">{order.invoiceNumber ?? "—"}</td><td className="px-4 py-4 font-bold">{order.buyerName ?? "—"}</td><td className="px-4 py-4">{formatPrice(order.totalAmount)}</td><td className="px-4 py-4"><StateBadge tone="blue">{order.orderStatus}</StateBadge></td><td className="px-4 py-4">{order.paymentStatus ?? "—"}</td><td className="px-4 py-4">{order.shippingStatus ?? "—"}</td><td className="px-4 py-4">{date(order.orderedAt)}</td><td className="px-4 py-4"><StateBadge tone={order.localOrderId ? "green" : "gold"}>{order.localOrderId ? "IMPORTED" : "PENDING"}</StateBadge></td><td className="px-4 py-4"><button disabled={Boolean(order.localOrderId)} className={secondaryButtonClass} onClick={() => importOrder(order)}>Import</button></td>
          </tr>)}</tbody>
        </table></TableShell>
      )}
    </PageWrapper>
  );
}

export function MarketplaceSyncLogsView() {
  const [items, setItems] = useState<MarketplaceSyncLog[] | null>(null);
  useEffect(() => { getMarketplaceSyncLogs().then((data) => setItems(data.items)).catch((error) => toast.error(error.message)); }, []);
  if (!items) return <Loading />;
  return <PageWrapper className="mx-auto max-w-7xl p-6 lg:p-10"><ErpHeader title="Sync logs" description="Audit trail for marketplace connection, sync, linking, and import operations." />{!items.length ? <EmptyState icon={FiActivity} title="No sync logs" description="Marketplace operations will appear here." actionLabel="Open ERP overview" href="/admin/erp" /> : <TableShell><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Provider","Action","Status","Message","Started At","Finished At"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="px-4 py-4">{providerLabel(item.provider)}</td><td className="px-4 py-4 font-mono text-xs">{item.action}</td><td className="px-4 py-4"><StateBadge tone={item.status === "SUCCESS" ? "green" : item.status === "FAILED" ? "red" : "gold"}>{item.status}</StateBadge></td><td className="px-4 py-4">{item.message ?? "—"}</td><td className="px-4 py-4">{date(item.startedAt)}</td><td className="px-4 py-4">{date(item.finishedAt)}</td></tr>)}</tbody></table></TableShell>}</PageWrapper>;
}

export function MarketplaceWebhooksView() {
  const [items, setItems] = useState<MarketplaceWebhookEvent[] | null>(null);
  const [selected, setSelected] = useState<MarketplaceWebhookEvent | null>(null);
  useEffect(() => { getMarketplaceWebhookEvents().then((data) => setItems(data.items)).catch((error) => toast.error(error.message)); }, []);
  if (!items) return <Loading />;
  return <PageWrapper className="mx-auto max-w-7xl p-6 lg:p-10"><ErpHeader title="Webhook events" description="Received marketplace notifications and processing outcomes." />{!items.length ? <EmptyState icon={FiRadio} title="No webhook events" description="Post a mock event to the public webhook endpoint to test processing." actionLabel="Open ERP overview" href="/admin/erp" /> : <TableShell><table className="w-full min-w-[1100px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Provider","Event Type","Event ID","Status","Received At","Processed At","Error Message","Payload"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="px-4 py-4">{providerLabel(item.provider)}</td><td className="px-4 py-4 font-mono text-xs">{item.eventType}</td><td className="px-4 py-4">{item.eventId ?? "—"}</td><td className="px-4 py-4"><StateBadge tone={item.status === "PROCESSED" ? "green" : item.status === "FAILED" ? "red" : "gold"}>{item.status}</StateBadge></td><td className="px-4 py-4">{date(item.createdAt)}</td><td className="px-4 py-4">{date(item.processedAt)}</td><td className="px-4 py-4 text-red-600">{item.errorMessage ?? "—"}</td><td className="px-4 py-4"><button className={secondaryButtonClass} onClick={() => setSelected(item)}>View</button></td></tr>)}</tbody></table></TableShell>}{selected ? <div className="fixed inset-0 z-[80] grid place-items-center bg-navy/70 p-4" onClick={() => setSelected(null)}><div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex justify-between"><h2 className="text-xl font-black text-navy">Webhook payload</h2><button onClick={() => setSelected(null)}>Close</button></div><pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-green-300">{JSON.stringify(selected.payload, null, 2)}</pre></div></div> : null}</PageWrapper>;
}

export function MarketplaceSettingsView() {
  const [accounts, setAccounts] = useState<MarketplaceAccount[] | null>(null);
  const load = useCallback(() => getMarketplaceAccounts().then(setAccounts).catch((error) => toast.error(error.message)), []);
  useEffect(() => { void load(); }, [load]);
  async function toggle(provider: MarketplaceProvider, active: boolean) {
    try { active ? await disconnectMarketplace(provider) : await connectMarketplace(provider); toast.success(active ? "Marketplace disconnected" : "Marketplace connected"); await load(); }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : "Action failed"); }
  }
  if (!accounts) return <Loading />;
  return <PageWrapper className="mx-auto max-w-5xl p-6 lg:p-10"><ErpHeader title="Marketplace settings" description="Adapter mode and shop connection controls. Secrets remain server-side." /><div className="rounded-2xl border border-gold/30 bg-gold/10 p-5"><div className="flex items-center gap-3"><FiDatabase className="text-2xl text-gold" /><div><p className="font-black text-navy">Adapter mode is controlled by MARKETPLACE_MODE</p><p className="text-sm text-slate-600">Mock mode never requires partner credentials. Live mode validates credentials only when used.</p></div></div></div><div className="mt-6 grid gap-4">{providers.map((provider) => { const account = accounts.find((item) => item.provider === provider); const active = Boolean(account?.isActive); return <div key={provider} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"><div><h2 className="text-xl font-black text-navy">{providerLabel(provider)}</h2><p className="mt-1 text-sm text-slate-500">{account?.shopName ?? "No shop configured"} · {account?.shopId ?? "—"}</p></div><div className="flex items-center gap-3"><StateBadge tone={active ? "green" : "red"}>{active ? "CONNECTED" : "DISCONNECTED"}</StateBadge><button className={secondaryButtonClass} onClick={() => toggle(provider, active)}>{active ? "Disconnect" : "Connect"}</button></div></div>; })}</div><div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6"><FiSettings className="text-2xl text-gold" /><h2 className="mt-3 text-lg font-black text-navy">Live mode readiness</h2><p className="mt-2 text-sm text-slate-600">Live adapters contain no guessed endpoints. Add approved Partner Center URLs, credentials, scopes, token encryption, and signature verification before switching modes.</p></div></PageWrapper>;
}
