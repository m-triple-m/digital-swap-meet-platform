'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    fetch('http://localhost:5000/api/items/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-4">My Items</h2>
      <div className="mb-4 space-x-2">
        <Link href="/add-item" className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</Link>
        <Link href="/browse" className="bg-gray-700 text-white px-4 py-2 rounded">Browse Items</Link>
        <Link href="/my-swaps" className="bg-green-600 text-white px-4 py-2 rounded">My Swaps</Link>
      </div>
      <ul>
        {items.map(item => (
          <li key={item._id} className="mb-2 p-2 border rounded bg-white">
            <b>{item.name}</b> - {item.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
