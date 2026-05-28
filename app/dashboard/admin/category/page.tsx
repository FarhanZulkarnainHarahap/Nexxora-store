"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiAlertCircle, FiEdit, FiPlusCircle, FiRefreshCw, FiSave, FiTag, FiTrash2, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import PageWrapper from "@/components/ui/PageWrapper";
import { apiFetch, authFetch } from "@/lib/api";
import type { Category, Product } from "@/types/product";

type ModalMode = "create" | "edit";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");

  async function loadCategoryData() {
    setLoading(true);
    try {
      const [categoryData, productData] = await Promise.all([
        apiFetch<Category[]>("/categories"),
        apiFetch<Product[]>("/products"),
      ]);
      setCategories(categoryData);
      setProducts(productData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load category data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategoryData();
  }, []);

  function getProductCount(category: Category) {
    return category._count?.products ?? products.filter((product) => product.category.id === category.id).length;
  }

  function openCreateModal() {
    setSelectedCategory(null);
    setCategoryName("");
    setMode("create");
    setModalOpen(true);
  }

  function openEditModal(category: Category) {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setMode("edit");
    setModalOpen(true);
  }

  function openDeleteDialog(category: Category) {
    setSelectedCategory(category);
    setDeleteOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setSelectedCategory(null);
    setCategoryName("");
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        await authFetch<Category>("/categories", {
          method: "POST",
          body: JSON.stringify({ name: categoryName.trim() }),
        });
        toast.success("Category created successfully");
      } else if (selectedCategory) {
        await authFetch<Category>(`/categories/${selectedCategory.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: categoryName.trim() }),
        });
        toast.success("Category updated successfully");
      }

      setModalOpen(false);
      setSelectedCategory(null);
      setCategoryName("");
      await loadCategoryData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory() {
    if (!selectedCategory) return;

    setDeleting(true);
    try {
      await authFetch<{ id: string }>(`/categories/${selectedCategory.id}`, {
        method: "DELETE",
      });
      toast.success("Category deleted successfully");
      setDeleteOpen(false);
      setSelectedCategory(null);
      await loadCategoryData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-panel accent-ring rounded-2xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-gold">
              <FiTag />
              <p className="font-semibold">Admin / Category</p>
            </div>
            <h1 className="mt-3 text-4xl font-black text-offWhite">Category Management</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Kelola category katalog Nexxora untuk filter customer dan form product admin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatedButton iconLeft={FiRefreshCw} variant="secondary" onClick={loadCategoryData}>
              Refresh
            </AnimatedButton>
            <AnimatedButton iconLeft={FiPlusCircle} onClick={openCreateModal}>
              Create Category
            </AnimatedButton>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <motion.div whileHover={{ y: -4 }} className="surface-panel rounded-2xl p-5">
          <p className="text-sm font-semibold uppercase text-muted">Total Category</p>
          <p className="mt-2 text-3xl font-black text-offWhite">{categories.length}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="surface-panel rounded-2xl p-5">
          <p className="text-sm font-semibold uppercase text-muted">Assigned Products</p>
          <p className="mt-2 text-3xl font-black text-offWhite">{products.length}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="surface-panel rounded-2xl p-5">
          <p className="text-sm font-semibold uppercase text-muted">Empty Category</p>
          <p className="mt-2 text-3xl font-black text-offWhite">
            {categories.filter((category) => getProductCount(category) === 0).length}
          </p>
        </motion.div>
      </section>

      <section className="surface-panel mt-8 rounded-2xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-offWhite">Category List</h2>
            <p className="text-sm text-muted">Create, update, dan delete category dari menu dropdown Product.</p>
          </div>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-bold text-gold">
            {categories.length} categories
          </span>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={FiTag}
              title="No categories yet"
              description="Create a category before adding products to Nexxora catalog."
              actionLabel="Create Category"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-navy/45 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
                    <FiTag />
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-muted">
                    {getProductCount(category)} products
                  </span>
                </div>
                <h3 className="mt-4 truncate text-lg font-black text-offWhite">{category.name}</h3>
                <p className="truncate text-sm text-muted">{category.slug}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(category)}
                    className="grid h-10 flex-1 place-items-center rounded-xl border border-gold/35 text-gold transition hover:bg-gold hover:text-navy"
                    aria-label={`Edit ${category.name}`}
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteDialog(category)}
                    className="grid h-10 flex-1 place-items-center rounded-xl bg-danger/15 text-red-200 transition hover:bg-danger hover:text-white"
                    aria-label={`Delete ${category.name}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <CategoryModal
        mode={mode}
        name={categoryName}
        open={modalOpen}
        saving={saving}
        onClose={closeModal}
        onNameChange={setCategoryName}
        onSubmit={handleCategorySubmit}
      />

      <CategoryDeleteConfirmModal
        category={selectedCategory}
        deleting={deleting}
        open={deleteOpen}
        productCount={selectedCategory ? getProductCount(selectedCategory) : 0}
        onCancel={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategory}
      />
    </PageWrapper>
  );
}

type CategoryModalProps = {
  mode: ModalMode;
  name: string;
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function CategoryModal({ mode, name, open, saving, onClose, onNameChange, onSubmit }: CategoryModalProps) {
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
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            className="surface-panel w-full max-w-md rounded-2xl p-6 shadow-gold"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase text-gold">
                  <FiTag />
                  {mode === "create" ? "Create Category" : "Update Category"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-offWhite">
                  {mode === "create" ? "Add New Category" : "Edit Category"}
                </h2>
                <p className="mt-2 text-sm text-muted">Category akan digunakan pada filter dan form produk.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 p-3 text-muted transition hover:bg-white/10 hover:text-offWhite"
                aria-label="Close category modal"
              >
                <FiX />
              </button>
            </div>

            <div className="mt-6">
              <Input
                label="Category Name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Fashion"
                icon={<FiTag />}
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AnimatedButton type="button" variant="ghost" onClick={onClose} disabled={saving}>
                Cancel
              </AnimatedButton>
              <AnimatedButton type="submit" iconLeft={FiSave} loading={saving}>
                {mode === "create" ? "Create Category" : "Save Update"}
              </AnimatedButton>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type CategoryDeleteConfirmModalProps = {
  category: Category | null;
  deleting: boolean;
  open: boolean;
  productCount: number;
  onCancel: () => void;
  onConfirm: () => void;
};

function CategoryDeleteConfirmModal({
  category,
  deleting,
  open,
  productCount,
  onCancel,
  onConfirm,
}: CategoryDeleteConfirmModalProps) {
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
                <h2 className="text-2xl font-black text-offWhite">Delete category?</h2>
                <p className="mt-2 text-muted">
                  Apakah kamu yakin ingin menghapus category{" "}
                  <span className="font-bold text-gold">{category?.name ?? "this category"}</span>?
                </p>
                {productCount > 0 ? (
                  <p className="mt-3 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-red-100">
                    Category ini memiliki {productCount} product. Menghapus category dapat ikut menghapus product di
                    dalamnya.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AnimatedButton type="button" variant="ghost" onClick={onCancel} disabled={deleting}>
                Cancel
              </AnimatedButton>
              <AnimatedButton type="button" variant="danger" iconLeft={FiTrash2} loading={deleting} onClick={onConfirm}>
                Delete Category
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
