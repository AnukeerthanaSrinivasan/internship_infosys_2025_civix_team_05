import React, { useEffect, useMemo, useState } from 'react';

// Reusable calendar widget with persistent state across pages
export default function CalendarWidget({ storageKey = 'calendar-widget' }) {
  const readPersistedState = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  };

  const persisted = readPersistedState();
  const initialSelected = persisted?.selectedDate ? new Date(persisted.selectedDate) : new Date();
  const initialMonth = persisted?.currentMonth ?? initialSelected.getMonth();
  const initialYear = persisted?.currentYear ?? initialSelected.getFullYear();

  const [selectedDate, setSelectedDate] = useState(initialSelected);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          selectedDate: selectedDate?.toISOString?.() || null,
          currentMonth,
          currentYear,
        })
      );
    } catch (_) {
      // ignore persistence errors
    }
  }, [storageKey, selectedDate, currentMonth, currentYear]);

  const monthName = useMemo(
    () => new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }),
    [currentMonth, currentYear]
  );

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, currentMonth: false, selected: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        i === selectedDate.getDate() &&
        currentMonth === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear();
      days.push({ day: i, currentMonth: true, selected: isSelected });
    }
    for (let i = 1; i <= 42 - days.length; i++) {
      days.push({ day: i, currentMonth: false, selected: false });
    }
    return days;
  };

  const handlePrevMonth = () =>
    setCurrentMonth(prev => (prev === 0 ? (setCurrentYear(y => y - 1), 11) : prev - 1));
  const handleNextMonth = () =>
    setCurrentMonth(prev => (prev === 11 ? (setCurrentYear(y => y + 1), 0) : prev + 1));
  const handleDateSelect = (day, isCurrentMonth) => {
    if (isCurrentMonth) setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button className="prev-month" onClick={handlePrevMonth}>&lt;</button>
        <div className="current-month">{monthName} {currentYear}</div>
        <button className="next-month" onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-days">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d, i) => (
          <div key={i} className="weekday">{d}</div>
        ))}
        {generateCalendarDays().map((day, index) => (
          <div
            key={index}
            className={`day ${!day.currentMonth ? 'prev-month' : ''} ${day.selected ? 'selected' : ''}`}
            onClick={() => handleDateSelect(day.day, day.currentMonth)}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );
}


