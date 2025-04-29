'use client';

export default function WeekView({ selectedDate, appointments, onDateSelect, onDayClick }) {
    {/* Get the start of the week (Sunday) */}
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    {/* Generate days of the week */}
    const days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
    }

    {/* Generate time slots (7am to 9pm) */}
    const timeSlots = [];
    for (let hour = 7; hour <= 21; hour++) {
        timeSlots.push(`${hour}:00`);
        if (hour !== 21) timeSlots.push(`${hour}:30`);
    }

    {/* Parse time string to get hours and minutes */}
    const parseTimeString = (timeStr) => {
        if (!timeStr) return { hours: 0, minutes: 0 };
    
        const [timePart, period] = timeStr.includes(' ') ? timeStr.split(' ') : [timeStr, null];
        let [hours, minutes] = timePart.split(':').map(Number);
    
        if (isNaN(hours) || isNaN(minutes)) return { hours: 0, minutes: 0 };
    
        {/* Convert to 24-hour format if AM/PM is present */}
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
    
        return { hours, minutes };
    };
    

    {/* Convert 24-hour format to 12-hour format */}
    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;
        return `${displayHour}:${minutes === 0 ? '00' : minutes} ${period}`;
    };

    {/* Calculate appointment position and height */}
    const calculateAppointmentDisplay = (appt) => {
        const apptDate = new Date(appt.date);

        {/* Parse start time */}
        const startTimeStr = appt.startTime || appt.time;
        const { hours: startHour, minutes: startMinute } = parseTimeString(startTimeStr);

        {/* Calculate duration in minutes */}
        let duration = appt.duration || 30; // Default to 30 minutes

        {/* Calculate position based on time (each slot is 30 minutes) */}
        const timePosition = ((startHour - 7) * 2) + (startMinute === 30 ? 1 : 0);

        {/* Calculate height based on duration (30 minutes = 1 block) */}
        const blocks = Math.ceil(duration / 30);
        const height = blocks * 48; // Each block is 48px tall

        {/* Calculate end time */}
        const endMinutes = startHour * 60 + startMinute + duration;
        const endHour = Math.floor(endMinutes / 60);
        const endMinute = endMinutes % 60;

        return {
            timePosition,
            height,
            startTime: formatTime(startHour, startMinute),
            endTime: formatTime(endHour, endMinute)
        };
    };

    return (
        <div className="p-4 rounded-lg bg-white shadow-sm mt-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    {startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex space-x-2">
                    <button
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                        onClick={() => onDateSelect(new Date())}
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* Week header with day names */}
            <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="bg-gray-50 p-2"></div> {/* Empty cell for time column */}
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`bg-gray-50 p-2 text-center cursor-pointer hover:bg-gray-100 
              ${day.getDate() === selectedDate.getDate() &&
                                day.getMonth() === selectedDate.getMonth() ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                            onDateSelect(day);
                            if (onDayClick) onDayClick(day);
                        }}
                    >
                        <div className="font-medium text-gray-500">
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className={`text-sm font-semibold 
              ${day.getDate() === selectedDate.getDate() &&
                                day.getMonth() === selectedDate.getMonth() ?
                                'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
                            {day.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time slots and events */}
            <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-b-lg overflow-hidden" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Time column */}
                <div className="bg-gray-50">
                    {timeSlots.map((time, index) => (
                        <div key={index} className="h-12 p-1 text-xs text-gray-500 border-b border-gray-200 flex items-end justify-end pr-2">
                            {time}
                        </div>
                    ))}
                </div>

                {/* Day columns */}
                {days.map((day, dayIndex) => {
                    // Filter appointments for this day
                    const dayAppointments = appointments.filter(appt => {
                        const apptDate = new Date(appt.date);
                        return (
                            apptDate.getFullYear() === day.getFullYear() &&
                            apptDate.getMonth() === day.getMonth() &&
                            apptDate.getDate() === day.getDate()
                        );
                    });

                    return (
                        <div
                            key={dayIndex}
                            className={`bg-white relative ${day.getDate() === selectedDate.getDate() &&
                                    day.getMonth() === selectedDate.getMonth() ? 'bg-blue-50' : ''
                                }`}
                        >
                            {timeSlots.map((time, timeIndex) => (
                                <div key={timeIndex} className="h-12 border-b border-gray-200"></div>
                            ))}

                            {/* Render appointments */}
                            {dayAppointments.map((appt, idx) => {
                                const { timePosition, height, startTime, endTime } = calculateAppointmentDisplay(appt);

                                return (
                                    <div
                                        key={appt.id || `appt-${idx}`}
                                        className="absolute left-1 right-1 bg-green-100 border-l-4 border-green-500 mt-12 rounded p-1 text-xs shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                        style={{
                                            top: `${timePosition * 48 + 2}px`,
                                            height: `${height - 4}px`,
                                        }}
                                    >
                                        <div className="font-medium truncate text-green-800">
                                            {startTime} - {endTime}
                                        </div>
                                        <div className="truncate text-green-600">{appt.doctor}</div>
                                        {height >= 30 && (
                                            <div className="truncate text-green-600 text-xs">{appt.name}</div>
                                        )}
                                        {height >= 60 && appt.reason && (
                                            <div className="truncate text-gray-500 text-xs italic">{appt.reason}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}