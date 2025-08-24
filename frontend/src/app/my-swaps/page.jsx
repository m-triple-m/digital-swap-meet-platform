'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MySwaps() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    fetch('http://localhost:5000/api/swaps/my-swaps', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSent(data.sent || []);
        setReceived(data.received || []);
      });
  }, []);

  const handleAction = async (id, status) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/swaps/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const d = await res.json();
      setError(d.error || 'Failed to update swap');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-4">My Swaps</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Sent Requests</h3>
        <ul>
          {sent.map(swap => (
            <li key={swap._id} className="mb-2 p-2 border rounded bg-white">
              To: {swap.toUserId?.name || 'Unknown'} | Item: {swap.itemRequestedId?.name} | Status: <b>{swap.status}</b>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Received Requests</h3>
        <ul>
          {received.map(swap => (
            <li key={swap._id} className="mb-2 p-2 border rounded bg-white">
              From: {swap.fromUserId?.name || 'Unknown'} | Item: {swap.itemRequestedId?.name} | Status: <b>{swap.status}</b>
              {swap.status === 'Pending' && (
                <>
                  <button onClick={() => handleAction(swap._id, 'Accepted')} className="ml-2 bg-green-600 text-white px-2 py-1 rounded">Accept</button>
                  <button onClick={() => handleAction(swap._id, 'Declined')} className="ml-2 bg-red-600 text-white px-2 py-1 rounded">Decline</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
