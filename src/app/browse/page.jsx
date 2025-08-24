'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/items/')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setItems(data)
      });
  }, []);

  const handleRequestSwap = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    // Prompt for which of user's items to offer
    const myItemsRes = await fetch('http://localhost:5000/api/items/my', { headers: { Authorization: `Bearer ${token}` } });
    const myItems = await myItemsRes.json();
    const itemOfferedId = prompt('Enter the ID of your item to offer for swap:', myItems[0]?._id || '');
    if (!itemOfferedId) return;
    const res = await fetch('http://localhost:5000/api/swaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        toUserId: item.userId._id,
        itemOfferedId,
        itemRequestedId: item._id
      })
    });
    if (res.ok) {
      alert('Swap request sent!');
    } else {
      const d = await res.json();
      setError(d.error || 'Failed to send swap request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-full h-40 object-cover mb-2 rounded" />
            <div className="font-bold">{item.name}</div>
            <div className="text-sm text-gray-600">{item.category}</div>
            <div className="text-gray-700 mb-2">{item.description}</div>
            <div className="text-xs text-gray-500 mb-2">Owner: {item.userId?.name || 'Unknown'}</div>
            <div className="text-xs text-gray-500 mb-2">Wants: {item.wantedItem}</div>
            <button onClick={() => handleRequestSwap(item)} className="bg-green-600 text-white px-3 py-1 rounded">Request Swap</button>
          </div>
        ))}
      </div>
    </div>
  );
}
