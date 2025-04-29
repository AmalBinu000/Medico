'use client';

export default function DayView({ selectedDate, appointments, onDateSelect }) {
   {/* Filter appointments for the selected day*/} 
    const dayAppointments = appointments.filter((appt) => {
        const apptDate = new Date(appt.date);
        return (
            apptDate.getFullYear() === selectedDate.getFullYear() &&
            apptDate.getMonth() === selectedDate.getMonth() &&
            apptDate.getDate() === selectedDate.getDate()
        );
    });

    {/* Parse time string to get hours and minutes */}
    const parseTimeString = (timeStr) => {
        if (!timeStr) return { hours: 0, minutes: 0 };

        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

        {/* Convert to 24-hour format */}
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return { hours, minutes };
    };

    {/* Generate time slots (7am to 9pm) */}
    const timeSlots = [];
    for (let hour = 7; hour <= 21; hour++) {
        timeSlots.push({
            hour,
            minute: 0,
            displayTime: `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`
        });
        if (hour !== 21) {
            timeSlots.push({
                hour,
                minute: 30,
                displayTime: `${hour % 12 === 0 ? 12 : hour % 12}:30 ${hour >= 12 ? 'PM' : 'AM'}`
            });
        }
    }

    {/* Helper function to find appointments for a specific time slot */}
    const findAppointmentsAtTime = (hour, minute) => {
        return dayAppointments.filter(appt => {
            { /* Use startTime if available, fallback to time */}
            const timeStr = appt.startTime || appt.time;
            if (!timeStr) return false;

            const { hours, minutes } = parseTimeString(timeStr);

            {/* Check if this appointment starts at this time slot */}
            if (hours === hour && (
                (minute === 0 && minutes < 30) ||
                (minute === 30 && minutes >= 30)
            )) {
                return true;
            }

            {/* Calculate end time and check if appointment spans this time slot */}
            if (appt.duration) {
                const startMinutes = hours * 60 + minutes;
                const endMinutes = startMinutes + appt.duration;
                const slotMinutes = hour * 60 + minute;

                {/* Check if this slot is within the appointment duration */}
                return slotMinutes > startMinutes && slotMinutes < endMinutes;
            }

            {/* If we have explicit end time */}
            if (appt.endTime) {
                const { hours: endHours, minutes: endMinutes } = parseTimeString(appt.endTime);
                const startMinutes = hours * 60 + minutes;
                const endTotalMinutes = endHours * 60 + endMinutes;
                const slotMinutes = hour * 60 + minute;

                {/* Check if this slot is within the appointment duration */}
                return slotMinutes > startMinutes && slotMinutes < endTotalMinutes;
            }

            return false;
        });
    };

    {/* Navigate to previous day */}
    const goToPreviousDay = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        onDateSelect(prevDay);
    };

    {/* Navigate to next day */}
    const goToNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        onDateSelect(nextDay);
    };

    {/* Check if an appointment is continuing from previous slot */}
    const isContinuingAppointment = (appt, hour, minute) => {
        const timeStr = appt.startTime || appt.time;
        if (!timeStr) return false;

        const { hours, minutes } = parseTimeString(timeStr);
        const slotMinutes = hour * 60 + minute;
        const startMinutes = hours * 60 + minutes;

        return slotMinutes > startMinutes;
    };

    return (
        <div className="p-4 border mt-4 border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={goToPreviousDay}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold">
                    {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </h2>

                <button
                    onClick={goToNextDay}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            <div className="text-center mb-2">
                <button
                    onClick={() => onDateSelect(new Date())}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                    Today
                </button>
            </div>

            <div className="grid grid-cols-1 gap-px bg-gray-200 overflow-y-auto rounded-lg" style={{ maxHeight: '70vh' }}>
                {timeSlots.map((timeSlot, index) => {
                    const appointmentsAtTime = findAppointmentsAtTime(timeSlot.hour, timeSlot.minute);

                    return (
                        <div key={index} className="bg-white p-2 min-h-16 border-b border-gray-200 grid grid-cols-6">
                            <div className="text-gray-500 col-span-1 flex items-center">
                                {timeSlot.displayTime}
                            </div>
                            <div className="col-span-5">
                                {appointmentsAtTime.length > 0 ? (
                                    <div className="space-y-2">
                                        {appointmentsAtTime.map((appt, idx) => {
                                            {/* Only render the full appointment card for the first time slot it appears in */}
                                            const continuing = isContinuingAppointment(appt, timeSlot.hour, timeSlot.minute);

                                            {/* Get start and end times */}
                                            const startTime = appt.startTime || appt.time;
                                            const endTime = appt.endTime || '';

                                            return (
                                                <div key={appt.id || `day-appt-${idx}`}
                                                    className={`${continuing ? 'bg-green-50 border-l-4 border-green-200' : 'bg-green-100 border-l-4 border-green-500'} 
                            p-2 rounded shadow-sm hover:shadow transition-shadow`}>
                                                    {!continuing ? (
                                                        <>
                                                            <div className="font-medium flex justify-between">
                                                                <span>{startTime} - {endTime}</span>
                                                                <span className="text-green-700">{appt.doctor}</span>
                                                            </div>
                                                            <div className="text-sm flex justify-between mt-1">
                                                                <span>{appt.name}</span>
                                                                {appt.duration && (
                                                                    <span className="text-gray-500 text-xs">
                                                                        {appt.duration} min
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {appt.reason && (
                                                                <div className="text-xs text-gray-600 mt-1 italic">
                                                                    {appt.reason}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-xs text-gray-500 italic">
                                                            (Appointment in progress)
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full w-full flex items-center">
                                        <div className="border border-dashed border-gray-300 rounded-md w-full py-1 text-center text-gray-400 text-sm">
                                            Available
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}