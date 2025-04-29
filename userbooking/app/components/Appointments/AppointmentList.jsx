'use client';

export default function AppointmentList({ appointments, onEdit }) {
  if (!appointments || appointments.length === 0) {
    return <p className="text-gray-500">No appointments scheduled for this date.</p>;
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div 
          key={appointment.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer"
          onClick={() => onEdit(appointment)}
        >
          <div className="flex justify-between">
            <div className="font-medium text-green-700">{appointment.time}</div>
            <div className="text-sm text-gray-500">
              {new Date(appointment.date).toLocaleDateString()}
            </div>
          </div>
          
          <div className="mt-2">
            <h3 className="font-semibold">{appointment.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{appointment.doctor}</span> - {appointment.specialty}
            </p>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>Reason: {appointment.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

