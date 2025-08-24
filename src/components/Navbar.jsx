'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold text-blue-700">SwapMeet</Link>
                    </div>
                    <div className="hidden md:flex space-x-4 items-center">
                        <Link href="/browse" className="hover:text-blue-600">Browse</Link>
                        {/* {isLoggedIn && <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>}
                        {isLoggedIn && <Link href="/my-swaps" className="hover:text-blue-600">My Swaps</Link>}
                        {!isLoggedIn && <Link href="/login" className="hover:text-blue-600">Login</Link>}
                        {!isLoggedIn && <Link href="/signup" className="hover:text-blue-600">Signup</Link>}
                        {isLoggedIn && <button onClick={handleLogout} className="ml-2 px-3 py-1 bg-red-500 text-white rounded">Logout</button>} */}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setOpen(!open)} className="text-gray-700 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {open && (
                <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 shadow">
                    <Link href="/browse" className="block px-3 py-2 rounded hover:bg-blue-100">Browse</Link>
                    {isLoggedIn && <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-blue-100">Dashboard</Link>}
                    {isLoggedIn && <Link href="/my-swaps" className="block px-3 py-2 rounded hover:bg-blue-100">My Swaps</Link>}
                    {!isLoggedIn && <Link href="/login" className="block px-3 py-2 rounded hover:bg-blue-100">Login</Link>}
                    {!isLoggedIn && <Link href="/signup" className="block px-3 py-2 rounded hover:bg-blue-100">Signup</Link>}
                    {isLoggedIn && <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded bg-red-500 text-white">Logout</button>}
                </div>
            )}
        </nav>
    );
}
