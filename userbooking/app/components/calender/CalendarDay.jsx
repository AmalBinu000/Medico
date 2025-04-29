'use client';

import { useAppointmentContext } from '../../context/AppointmentContext';

export default function CalendarDay({ day, isSelected, isToday, appointments, onClick }) {
  const { doctorColorMap } = useAppointmentContext(); // <-- Get color mapping from context
  const { date, isCurrentMonth } = day;

  const dayClasses = `appointment-cell cursor-pointer
    ${isSelected ? 'bg-blue-100 border-blue-400' : ''}
    ${isToday ? 'today' : ''}
    ${!isCurrentMonth ? 'different-month' : ''}
  `;

  return (
    <div className={dayClasses} onClick={onClick}>
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
          {date.getDate()}
        </span>
        {isCurrentMonth && appointments.length > 0 && (
          <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-1.5">
            {appointments.length}
          </span>
        )}
      </div>

      <div className="mt-1 space-y-1 max-h-16 overflow-hidden">
        {appointments.slice(0, 2).map((appointment) => {
          const color = doctorColorMap[appointment.doctor] || 'bg-gray-400';
          return (
            <div
              key={appointment.id}
              className={`appointment-badge text-white text-xs font-medium px-2 py-0.5 rounded ${color}`}
              title={appointment.doctor}
            >
              {appointment.time} - {appointment.doctor}
            </div>
          );
        })}
        {appointments.length > 2 && (
          <div className="text-xs text-gray-500 font-medium">
            +{appointments.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
}
