"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiEdit,
  FiImage,
  FiPackage,
  FiPlusCircle,
  FiRefreshCw,
  FiSave,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { apiFetch, authFetch, authMultipartFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/product";

type ModalMode = "create" | "edit";

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  image: File | null;
  isFeatured: boolean;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  image: null,
  isFeatured: false,
};

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const totalStock = useMemo(
    () => products.reduce((total, product) => total + product.stock, 0),
    [products],
  );

  async function loadAdminData() {
    setLoading(true);
    try {
      const [productData, categoryData] = await Promise.all([
        apiFetch<Product[]>("/products"),
        apiFetch<Category[]>("/categories"),
      ]);
      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load admin product data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  function openCreateModal() {
    setSelectedProduct(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setModalMode("create");
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.category.id,
      image: null,
      isFeatured: product.isFeatured ?? false,
    });
    setModalMode("edit");
    setModalOpen(true);
  }

  function openDeleteDialog(product: Product) {
    setSelectedProduct(product);
    setDeleteOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setSelectedProduct(null);
    setForm(emptyForm);
  }

  function setField(field: keyof ProductFormState, value: string | File | boolean | null) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function buildProductFormData() {
    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("categoryId", form.categoryId);
    formData.append("isFeatured", String(form.isFeatured));

    if (form.image) {
      formData.append("image", form.image);
    }

    return formData;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.price || !form.stock || !form.categoryId) {
      toast.error("Please complete product name, description, price, stock, and category");
      return;
    }

    if (modalMode === "create" && !form.image) {
      toast.error("Product image is required for new product");
      return;
    }

    setSaving(true);
    try {
      const formData = buildProductFormData();
      const product =
        modalMode === "create"
          ? await authMultipartFetch<Product>("/products", "POST", formData)
          : await authMultipartFetch<Product>(`/products/${selectedProduct?.id}`, "PUT", formData);

      setProducts((current) =>
        modalMode === "create"
          ? [product, ...current]
          : current.map((item) => (item.id === product.id ? product : item)),
      );
      toast.success(modalMode === "create" ? "Product created successfully" : "Product updated successfully");
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct() {
    if (!selectedProduct) return;

    setDeleting(true);
    try {
      await authFetch<{ id: string }>(`/products/${selectedProduct.id}`, {
        method: "DELETE",
      });
      setProducts((current) => current.filter((product) => product.id !== selectedProduct.id));
      toast.success("Product deleted successfully");
      setDeleteOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  const statCards = [
    { label: "Total Product", value: products.length },
    { label: "Category", value: categories.length },
    { label: "Total Stock", value: totalStock },
  ];
  const visibleProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = !categoryFilter || product.category.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-panel accent-ring rounded-2xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-gold">
              <FiShoppingBag />
              <p className="font-semibold">Admin / Product</p>
            </div>
            <h1 className="mt-3 text-4xl font-black text-offWhite">Product Management</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Kelola katalog Nexxora dengan modal create, update, upload image, dan konfirmasi delete.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatedButton iconLeft={FiRefreshCw} variant="secondary" onClick={loadAdminData}>
              Refresh
            </AnimatedButton>
            <AnimatedButton iconLeft={FiPlusCircle} onClick={openCreateModal}>
              Create Product
            </AnimatedButton>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -4 }}
            className="surface-panel rounded-2xl p-5"
          >
            <p className="text-sm font-semibold uppercase text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-black text-offWhite">{card.value}</p>
          </motion.div>
        ))}
      </section>

      <section className="surface-panel mt-8 overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-offWhite">Product List</h2>
            <p className="text-sm text-muted">Klik edit untuk membuka modal update, atau delete untuk konfirmasi.</p>
          </div>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-bold text-gold">
            {products.length} items
          </span>
        </div>

        <div className="grid gap-3 border-b border-white/10 p-5 md:grid-cols-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product..."
            className="h-11 rounded-xl border border-navy/10 bg-white px-4 text-navy placeholder:text-slate-400 focus:border-gold"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-11 rounded-xl border border-navy/10 bg-white px-4 text-navy focus:border-gold"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-5">
            <LoadingSkeleton type="product" count={4} />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiPackage}
              title="No products yet"
              description="Create your first Nexxora product for the catalog."
              actionLabel="Create Product"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-white/10 bg-navy/45 text-sm uppercase text-muted">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 transition hover:bg-white/[0.04]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-navy">
                          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-offWhite">{product.name}</p>
                          <p className="line-clamp-1 text-sm text-muted">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">{product.category.name}</td>
                    <td className="px-5 py-4 font-bold text-gold">{formatPrice(product.price)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold",
                          product.stock > 0 ? "bg-success/15 text-green-300" : "bg-danger/15 text-red-200",
                        )}
                      >
                        {product.stock > 0 ? `${product.stock} stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <AnimatedButton
                          iconLeft={FiEdit}
                          variant="secondary"
                          className="min-h-10 px-4 py-2"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </AnimatedButton>
                        <AnimatedButton
                          iconLeft={FiTrash2}
                          variant="danger"
                          className="min-h-10 px-4 py-2"
                          onClick={() => openDeleteDialog(product)}
                        >
                          Delete
                        </AnimatedButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ProductModal
        categories={categories}
        form={form}
        mode={modalMode}
        open={modalOpen}
        saving={saving}
        selectedProduct={selectedProduct}
        onClose={closeModal}
        onFieldChange={setField}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal
        deleting={deleting}
        open={deleteOpen}
        product={selectedProduct}
        onCancel={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
      />

    </PageWrapper>
  );
}

type ProductModalProps = {
  categories: Category[];
  form: ProductFormState;
  mode: ModalMode;
  open: boolean;
  saving: boolean;
  selectedProduct: Product | null;
  onClose: () => void;
  onFieldChange: (field: keyof ProductFormState, value: string | File | boolean | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ProductModal({
  categories,
  form,
  mode,
  open,
  saving,
  selectedProduct,
  onClose,
  onFieldChange,
  onSubmit,
}: ProductModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="surface-panel no-scrollbar max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6 shadow-gold"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase text-gold">
                  <FiImage />
                  {mode === "create" ? "Create Product" : "Update Product"}
                </p>
                <h2 className="mt-2 text-3xl font-black text-offWhite">
                  {mode === "create" ? "Add Nexxora Product" : selectedProduct?.name}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Isi data produk dengan rapi. Image hanya wajib saat membuat product baru.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 p-3 text-muted transition hover:bg-white/10 hover:text-offWhite"
                aria-label="Close product modal"
              >
                <FiX />
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="Product Name"
                value={form.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
                placeholder="Nexxora Jacket"
              />
              <Input
                label="Price"
                type="number"
                min={0}
                value={form.price}
                onChange={(event) => onFieldChange("price", event.target.value)}
                placeholder="350000"
              />
              <Input
                label="Stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => onFieldChange("stock", event.target.value)}
                placeholder="24"
              />
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted">Category</span>
                <select
                  value={form.categoryId}
                  onChange={(event) => onFieldChange("categoryId", event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-navy/65 px-4 text-offWhite transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-muted">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => onFieldChange("description", event.target.value)}
                rows={4}
                placeholder="Describe product quality, material, and details"
                className="w-full resize-none rounded-xl border border-white/10 bg-navy/65 px-4 py-3 text-offWhite placeholder:text-muted/60 transition focus:border-gold focus:ring-4 focus:ring-gold/15"
              />
            </label>

            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-navy/45 p-4">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => onFieldChange("isFeatured", event.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              <span>
                <span className="block text-sm font-bold text-offWhite">Featured product</span>
                <span className="mt-1 block text-xs text-muted">Show this item in curated storefront sections.</span>
              </span>
            </label>

            <label className="mt-5 block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-navy/45 p-5 transition hover:border-gold/50 hover:bg-gold/5">
              <span className="flex items-center gap-3 text-sm font-bold text-offWhite">
                <FiImage className="text-gold" />
                {form.image ? form.image.name : mode === "create" ? "Upload product image" : "Upload new image optional"}
              </span>
              <span className="mt-2 block text-sm text-muted">JPEG, PNG, JPG, or WEBP.</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="sr-only"
                onChange={(event) => onFieldChange("image", event.target.files?.[0] ?? null)}
              />
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AnimatedButton type="button" variant="ghost" onClick={onClose} disabled={saving}>
                Cancel
              </AnimatedButton>
              <AnimatedButton type="submit" iconLeft={FiSave} loading={saving}>
                {mode === "create" ? "Create Product" : "Save Update"}
              </AnimatedButton>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type DeleteConfirmModalProps = {
  deleting: boolean;
  open: boolean;
  product: Product | null;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteConfirmModal({ deleting, open, product, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            className="surface-panel w-full max-w-md rounded-2xl p-6 shadow-gold"
          >
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-danger/15 text-2xl text-red-200">
                <FiAlertCircle />
              </span>
              <div>
                <h2 className="text-2xl font-black text-offWhite">Delete product?</h2>
                <p className="mt-2 text-muted">
                  Apakah kamu yakin ingin menghapus{" "}
                  <span className="font-bold text-gold">{product?.name ?? "this product"}</span>? Action ini tidak bisa
                  dibatalkan.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AnimatedButton type="button" variant="ghost" onClick={onCancel} disabled={deleting}>
                Cancel
              </AnimatedButton>
              <AnimatedButton type="button" variant="danger" iconLeft={FiTrash2} loading={deleting} onClick={onConfirm}>
                Delete Product
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
