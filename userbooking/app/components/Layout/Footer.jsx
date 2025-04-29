'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white shadow-inner mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-green-600">Medico</h3>
                        <p className="text-gray-600 text-sm">
                            Providing quality healthcare services and easy appointment scheduling for our patients.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-green-600 text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/appointments" className="text-gray-600 hover:text-green-600 text-sm">
                                    Book Appointment
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctors" className="text-gray-600 hover:text-green-600 text-sm">
                                    Our Doctors
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Our Services</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-600 text-sm">General Medicine</li>
                            <li className="text-gray-600 text-sm">Pediatrics</li>
                            <li className="text-gray-600 text-sm">Cardiology</li>
                            <li className="text-gray-600 text-sm">Orthopedics</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Contact Us</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-600 text-sm">
                                <span className="font-medium">Email:</span> contact@medico.com
                            </li>
                            <li className="text-gray-600 text-sm">
                                <span className="font-medium">Phone:</span> (555) 123-4567
                            </li>
                            <li className="text-gray-600 text-sm">
                                <span className="font-medium">Address:</span> 123 Medical Center Drive
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t mt-8 pt-6">
                    <p className="text-center text-gray-500 text-sm">
                        © {currentYear} Medico. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
