'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddItem() {
  const [form, setForm] = useState({ name: '', description: '', category: '', wantedItem: '', image: null });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    const res = await fetch('http://localhost:5000/api/items/add', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      const d = await res.json();
      setError(d.error || 'Failed to add item');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96" encType="multipart/form-data">
        <h2 className="text-2xl font-bold mb-4">Add Item</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input name="name" placeholder="Item Name" className="w-full mb-3 p-2 border rounded" required onChange={handleChange} />
        <input name="category" placeholder="Category" className="w-full mb-3 p-2 border rounded" required onChange={handleChange} />
        <input name="wantedItem" placeholder="What do you want in return?" className="w-full mb-3 p-2 border rounded" required onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="w-full mb-3 p-2 border rounded" required onChange={handleChange} />
        <input name="image" type="file" accept="image/*" className="w-full mb-3" required onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Item</button>
      </form>
    </div>
  );
}
