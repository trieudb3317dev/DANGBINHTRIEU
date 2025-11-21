'use client';

import React, { useEffect, useState } from 'react';
import usePublic from '@/hooks/usePublic';
import notify from '@/utils/notify';

type Product = {
  _id: string;
  name: string;
  image?: string | null;
  description?: string | null;
  price?: number | null;
  category?: any;
  create_by?: any;
};

type CategoryOption = { _id: string; name: string };

export default function ProductsPage() {
  const apiUrl = usePublic();
  const [list, setList] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const createBy = '1';

  useEffect(() => {
    loadList();
    loadCategories();
  }, []);

  const loadList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/products?page=1&limit=100`);
      if (!res.ok) throw new Error('Failed to load products');
      const json = await res.json();
      setList(json.data || []);
    } catch (err: any) {
      notify('error', String(err.message || err));
    } finally {
      setLoadingList(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/categories?page=1&limit=100`);
      if (!res.ok) return;
      const json = await res.json();
      const list = json.data || [];
      setCategories(list.map((c: any) => ({ _id: c._id, name: c.name })));
      if (list[0]) setCategory(list[0]._id);
    } catch (e) {
      // ignore
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    const fd = new FormData();
    fd.append('file', fileToUpload);
    const res = await fetch(`${apiUrl}/api/v1/upload`, {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.image_url || json.imageUrl || json.secure_url;
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setPrice('');
    setFile(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setName(p.name || '');
    setDescription(p.description || '');
    setPrice(p.price ?? '');
    setCategory(p.category?._id || p.category || (categories[0] && categories[0]._id) || '');
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure to activate/delete this product?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Delete failed');
      }
      notify('success', 'Product deleted/activated');
      await loadList();
    } catch (err: any) {
      notify('error', String(err.message || err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (file) imageUrl = await uploadFile(file);

      const body = {
        name,
        description,
        image: imageUrl,
        price: price === '' ? undefined : Number(price),
        category,
        create_by: createBy,
      };

      if (editing) {
        const res = await fetch(`${apiUrl}/api/v1/products/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Update failed');
        }
        notify('success', 'Product updated');
      } else {
        const res = await fetch(`${apiUrl}/api/v1/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Create failed');
        }
        notify('success', 'Product created');
      }

      setShowForm(false);
      await loadList();
    } catch (err: any) {
      notify('error', String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products Management</h2>
        <div className="flex gap-2">
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Add Product
          </button>
          <button onClick={loadList} className="px-3 py-2 border rounded" disabled={loadingList}>
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-6">
        {loadingList ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, idx) => (
                <tr key={p._id}>
                  <td className="p-2 border align-top">{idx + 1}</td>
                  <td className="p-2 border align-top">{p.name}</td>
                  <td className="p-2 border align-top">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-24 h-16 object-cover" />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-2 border align-top">{p.price ?? '—'}</td>
                  <td className="p-2 border align-top">
                    {p.category ? (p.category.name || p.category._id || p.category) : '—'}
                  </td>
                  <td className="p-2 border align-top">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="px-2 py-1 bg-red-600 text-white rounded">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="p-4 border rounded bg-white">
          <h3 className="text-lg font-medium mb-3">{editing ? 'Edit Product' : 'Create Product'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Price</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="border p-2 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">-- select --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
