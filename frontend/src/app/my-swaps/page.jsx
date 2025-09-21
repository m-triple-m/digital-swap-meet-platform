'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MySwaps() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('received');
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
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load swaps');
        setLoading(false);
      });
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(id);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`http://localhost:5000/api/swaps/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        // Update the local state instead of reloading
        setReceived(prev => prev.map(swap => 
          swap._id === id ? { ...swap, status } : swap
        ));
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to update swap');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Declined': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const SwapCard = ({ swap, type }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {type === 'sent' ? 'To:' : 'From:'} {type === 'sent' ? swap.toUserId?.name : swap.fromUserId?.name || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(swap.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        {getStatusBadge(swap.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-3 bg-gray-50">
          <p className="text-xs font-medium text-gray-600 mb-1">
            {type === 'sent' ? 'You want:' : 'They want:'}
          </p>
          <div className="flex items-center">
            {swap.itemRequestedId?.image && (
              <img 
                src={`http://localhost:5000/uploads/${swap.itemRequestedId.image}`} 
                alt={swap.itemRequestedId.name}
                className="w-10 h-10 object-cover rounded mr-2"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{swap.itemRequestedId?.name || 'Unknown Item'}</p>
              <p className="text-xs text-gray-500">{swap.itemRequestedId?.category}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-3 bg-gray-50">
          <p className="text-xs font-medium text-gray-600 mb-1">
            {type === 'sent' ? 'You offer:' : 'They offer:'}
          </p>
          <div className="flex items-center">
            {swap.itemOfferedId?.image && (
              <img 
                src={`http://localhost:5000/uploads/${swap.itemOfferedId.image}`} 
                alt={swap.itemOfferedId.name}
                className="w-10 h-10 object-cover rounded mr-2"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{swap.itemOfferedId?.name || 'Unknown Item'}</p>
              <p className="text-xs text-gray-500">{swap.itemOfferedId?.category}</p>
            </div>
          </div>
        </div>
      </div>

      {type === 'received' && swap.status === 'Pending' && (
        <div className="flex space-x-2 pt-2 border-t">
          <button
            onClick={() => handleAction(swap._id, 'Accepted')}
            disabled={actionLoading === swap._id}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === swap._id ? 'Processing...' : 'Accept'}
          </button>
          <button
            onClick={() => handleAction(swap._id, 'Declined')}
            disabled={actionLoading === swap._id}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === swap._id ? 'Processing...' : 'Decline'}
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading your swaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-gray-600">Manage your swap requests and offers</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Received Requests ({received.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sent Requests ({sent.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'received' && (
            <>
              {received.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No received requests</h3>
                  <p className="text-gray-500">You haven't received any swap requests yet.</p>
                </div>
              ) : (
                received.map(swap => (
                  <SwapCard key={swap._id} swap={swap} type="received" />
                ))
              )}
            </>
          )}

          {activeTab === 'sent' && (
            <>
              {sent.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                  <p className="text-gray-500">You haven't sent any swap requests yet.</p>
                </div>
              ) : (
                sent.map(swap => (
                  <SwapCard key={swap._id} swap={swap} type="sent" />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
