'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [stats, setStats] = useState({ users: 0, items: 0, swaps: 0 });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch featured items
    fetch('http://localhost:5000/api/items/featured')
      .then(res => res.json())
      .then(data => setFeaturedItems(data || []))
      .catch(err => console.error('Error fetching featured items:', err));

    // Fetch platform stats
    fetch('http://localhost:5000/api/stats')
      .then(res => res.json())
      .then(data => setStats(data || { users: 1250, items: 5840, swaps: 2100 }))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        alert('Successfully subscribed to newsletter!');
        setEmail('');
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section - start */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 pb-6 sm:pb-8 lg:pb-12">
        <section className="mx-auto max-w-screen-2xl px-4 md:px-8 py-16">
          <div className="mb-8 flex flex-wrap justify-between md:mb-16">
            <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/2 lg:pb-24 lg:pt-48">
              <h1 className="mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl">
                Swap, Trade &
                <br />
                <span className="text-indigo-600">Share Sustainably</span>
              </h1>
              <p className="max-w-md leading-relaxed text-gray-600 xl:text-lg mb-8">
                Join our community marketplace where you can trade items you don't need for things you want. 
                Reduce waste, save money, and connect with neighbors.
              </p>
              
              <div className="flex gap-4 mb-8">
                <Link 
                  href="/browse"
                  className="inline-block rounded-lg bg-indigo-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-700 focus-visible:ring active:bg-indigo-800 md:text-base"
                >
                  Browse Items
                </Link>
                <Link 
                  href="/signup"
                  className="inline-block rounded-lg border border-indigo-600 px-8 py-3 text-center text-sm font-semibold text-indigo-600 outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-50 focus-visible:ring active:bg-indigo-100 md:text-base"
                >
                  Join Now
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.users.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.items.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Items Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.swaps.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Successful Swaps</div>
                </div>
              </div>
            </div>
            
            <div className="mb-12 flex w-full md:mb-16 lg:w-1/2">
              <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&q=75&fit=crop&w=600&h=600"
                  loading="lazy"
                  alt="People exchanging items"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?auto=format&q=75&fit=crop&w=550&h=550"
                  loading="lazy"
                  alt="Sustainable living"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Hero Section - end */}

      {/* How It Works - start */}
      
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              Getting started is easy! Follow these simple steps to begin swapping.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">1. List Your Items</h3>
              <p className="text-gray-500">Upload photos and descriptions of items you want to trade.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">2. Find What You Want</h3>
              <p className="text-gray-500">Browse items from other users and find what you're looking for.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">3. Make the Swap</h3>
              <p className="text-gray-500">Connect with other users and arrange safe, local exchanges.</p>
            </div>
          </div>
        </div>
      </div>
    
      {/* How It Works - end */}

      {/* Featured Items - start */}
      <div className="bg-gray-50 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Featured Items
            </h2>
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              Check out some of the amazing items available for trade in our community.
            </p>
          </div>
          
          <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
            {featuredItems.length > 0 ? featuredItems.slice(0, 4).map(item => (
              <div key={item._id} className="group">
                <Link
                  href={`/browse`}
                  className="group relative mb-2 block h-96 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
                >
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    loading="lazy"
                    alt={item.name}
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-gray-800">
                      {item.category}
                    </span>
                  </div>
                </Link>
                <div className="flex items-start justify-between gap-2 px-2">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-500">Wants: {item.wantedItem}</span>
                  </div>
                </div>
              </div>
            )) : (
              // Placeholder items if no featured items
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="group">
                  <div className="group relative mb-2 block h-96 overflow-hidden rounded-lg bg-gray-200 shadow-lg lg:mb-3 animate-pulse">
                    <div className="h-full w-full bg-gray-300"></div>
                  </div>
                  <div className="px-2">
                    <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/browse"
              className="inline-block rounded-lg bg-indigo-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-700 focus-visible:ring active:bg-indigo-800 md:text-base"
            >
              View All Items
            </Link>
          </div>
        </div>
      </div>
      {/* Featured Items - end */}

      {/* Categories - start */}
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
            Popular Categories
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {[
              { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-600' },
              { name: 'Books', icon: '📚', color: 'bg-green-100 text-green-600' },
              { name: 'Clothing', icon: '👕', color: 'bg-purple-100 text-purple-600' },
              { name: 'Sports & Fitness', icon: '⚽', color: 'bg-orange-100 text-orange-600' },
              { name: 'Home & Garden', icon: '🏠', color: 'bg-pink-100 text-pink-600' },
              { name: 'Toys & Games', icon: '🎮', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Art & Crafts', icon: '🎨', color: 'bg-red-100 text-red-600' },
              { name: 'Music & Instruments', icon: '🎵', color: 'bg-indigo-100 text-indigo-600' }
            ].map((category, index) => (
              <Link
                key={index}
                href={`/browse?category=${category.name}`}
                className="group relative flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className={`absolute inset-0 ${category.color.split(' ')[0]} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <span className={`text-lg font-bold ${category.color.split(' ')[1]}`}>
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Categories - end */}

      {/* Call to Action - start */}
      <div className="bg-indigo-600 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col overflow-hidden rounded-lg bg-indigo-500 sm:flex-row md:h-80">
            <div className="flex w-full flex-col p-4 sm:w-3/5 sm:p-8 lg:w-1/2">
              <h2 className="mb-4 text-xl font-bold text-white md:text-2xl lg:text-4xl">
                Ready to Start Swapping?
              </h2>
              <p className="mb-8 max-w-md text-indigo-100">
                Join thousands of users who are already trading items, saving money, and helping the environment. 
                Your next great find is just a swap away!
              </p>
              <div className="mt-auto flex gap-4">
                <Link
                  href="/signup"
                  className="inline-block rounded-lg bg-white px-8 py-3 text-center text-sm font-semibold text-indigo-600 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/browse"
                  className="inline-block rounded-lg border border-white px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-white hover:text-indigo-600 focus-visible:ring active:bg-gray-100 md:text-base"
                >
                  Browse Items
                </Link>
              </div>
            </div>
            <div className="order-first h-48 w-full bg-indigo-700 sm:order-none sm:h-auto sm:w-2/5 lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&q=75&fit=crop&w=800&h=600"
                loading="lazy"
                alt="Community trading"
                className="h-full w-full object-cover object-center opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Call to Action - end */}

      {/* Newsletter - start */}
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col items-center rounded-lg bg-gray-100 p-4 sm:p-8 lg:flex-row lg:justify-between">
            <div className="mb-4 sm:mb-8 lg:mb-0">
              <h2 className="text-center text-xl font-bold text-indigo-600 sm:text-2xl lg:text-left lg:text-3xl">
                Stay Updated
              </h2>
              <p className="text-center text-gray-500 lg:text-left">
                Get notified about new items and community updates
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-end">
              <form onSubmit={handleNewsletterSubmit} className="mb-3 flex w-full max-w-md gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full flex-1 rounded border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 outline-none ring-indigo-300 transition duration-100 focus:ring"
                  required
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="inline-block rounded bg-indigo-600 px-8 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-700 focus-visible:ring active:bg-indigo-800 disabled:opacity-50 md:text-base"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 lg:text-right">
                By subscribing you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter - end */}
    </>
  );
};

export default Home;