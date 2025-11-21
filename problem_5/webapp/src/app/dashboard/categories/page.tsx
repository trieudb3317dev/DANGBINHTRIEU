'use client';

import usePublic from '@/hooks/usePublic';
import notify from '@/utils/notify';
import React, { useEffect, useState } from 'react';

type Category = {
  _id: string;
  name: string;
  image?: string | null;
  description?: string | null;
  create_by?: any;
};

export default function CategoriesPage() {
  const apiUrl = usePublic();
  // list + pagination minimal
  const [list, setList] = useState<Category[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // form state (used for create + edit)
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const createBy = '1';

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/categories?page=1&limit=100`);
      if (!res.ok) throw new Error('Failed to load categories');
      const json = await res.json();
      setList(json.data || []);
    } catch (err: any) {
      notify('error', String(err.message || err));
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
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
    setFile(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure to activate/delete this category?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Delete failed');
      }
      notify('success', 'Category deleted/activated');
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
        create_by: createBy,
      };

      if (editing) {
        const res = await fetch(`${apiUrl}/api/v1/categories/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Update failed');
        }
        notify('success', 'Category updated');
      } else {
        const res = await fetch(`${apiUrl}/api/v1/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Create failed');
        }
        notify('success', 'Category created');
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
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Categories Management</h2>
        <div className="flex gap-2">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Category
          </button>
          <button
            onClick={loadList}
            className="px-3 py-2 border rounded"
            disabled={loadingList}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* list */}
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
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Creator</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, idx) => (
                <tr key={c._id}>
                  <td className="p-2 border align-top">{idx + 1}</td>
                  <td className="p-2 border align-top">{c.name}</td>
                  <td className="p-2 border align-top">
                    {c.image ? <img src={c.image} alt={c.name} className="w-24 h-16 object-cover" /> : '—'}
                  </td>
                  <td className="p-2 border align-top">{c.description}</td>
                  <td className="p-2 border align-top">{(c.create_by && (c.create_by.username || c.create_by._id)) || '—'}</td>
                  <td className="p-2 border align-top">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button onClick={() => handleDelete(c._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">No categories</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* form (create/edit) */}
      {showForm && (
        <div className="p-4 border rounded bg-white">
          <h3 className="text-lg font-medium mb-3">{editing ? 'Edit Category' : 'Create Category'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded" />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Image</span>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" />
            </label>

            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
