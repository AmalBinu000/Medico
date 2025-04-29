'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { useState } from 'react';

export default function Header() {
    const { isSignedIn, user } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="Medico Logo" width={70} height={70} />
                        <span className="text-xl font-bold text-green-600 hidden sm:inline">Medico</span>
                    </Link>

                    {/* Main Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-600 hover:text-green-600 transition">
                            Home
                        </Link>
                        <Link href="/appointments" className="text-gray-600 hover:text-green-600 transition">
                            Appointments
                        </Link>
                        <Link
                            href="/doctors"
                            className="text-gray-600 hover:text-green-600 transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Doctors
                        </Link>

                        {/* Authentication */}
                        <div className="flex items-center space-x-4">
                            {isSignedIn ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        Welcome, {user.firstName || user.username}
                                    </span>
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-10 h-10 rounded-full"
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                                        Sign In
                                    </button>
                                </SignInButton>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-green-600 transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/appointments"
                                className="text-gray-600 hover:text-green-600 transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Appointments
                            </Link>
                            <Link
                                href="/doctors"
                                className="text-gray-600 hover:text-green-600 transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Doctors
                            </Link>

                            {isSignedIn ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        Welcome, {user.firstName || user.username}
                                    </span>
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                                        Sign In
                                    </button>
                                </SignInButton>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
