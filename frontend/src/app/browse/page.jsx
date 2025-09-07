'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const [selectedItemToSwap, setSelectedItemToSwap] = useState(null);
  const [itemRequested, setItemRequested] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/items/')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleRequestSwap = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    const myItemsRes = await fetch('http://localhost:5000/api/items/my', { headers: { Authorization: `Bearer ${token}` } });
    const myItemsData = await myItemsRes.json();
    setMyItems(myItemsData);
    setItemRequested(item);
    setShowModal(true);
  };

  const performSwap = async (itemOfferedId) => {
    const token = localStorage.getItem('token');
    setShowModal(false);
    const res = await fetch('http://localhost:5000/api/swaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        toUserId: itemRequested.userId._id,
        itemOfferedId,
        itemRequestedId: itemRequested._id
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Select an item to offer for swap</h3>
            {myItems.length === 0 ? (
              <div>You have no items to offer.</div>
            ) : (
              <ul>
                {myItems.map(myItem => (
                  <li key={myItem._id} className="mb-2 flex items-center justify-between">
                    <span>{myItem.name}</span>
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded ml-2"
                      onClick={() => performSwap(myItem._id)}
                    >
                      Offer this
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className="mt-4 text-gray-600" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
