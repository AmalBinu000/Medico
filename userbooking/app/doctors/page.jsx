'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAppointmentContext } from '../context/AppointmentContext';

export default function DoctorsPage() {
  const { Doctors } = useAppointmentContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter doctors based on the search query
  const filteredDoctors = Doctors.filter((doctor) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(lowerCaseSearch) ||
      doctor.specialty.toLowerCase().includes(lowerCaseSearch)
    );
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Our Doctors</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search doctors by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 transition hover:shadow-lg"
          >
            <Image
              src="/doctor.png"
              alt={doctor.name}
              width={80}
              height={80}
              className="rounded-full mb-4 object-cover mx-auto"
            />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">{doctor.name}</h2>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
