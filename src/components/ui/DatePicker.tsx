import React, { useState, useEffect, useRef } from "react";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<string>(value || "");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setDateValue(value);
    }
  }, [value]);

  // Get names of months and days
  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Format a date object as YYYY-MM-DD string
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Parse a YYYY-MM-DD string into a Date object
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Get days in month grid for calendar
  const getDaysInMonth = (year: number, month: number): (Date | null)[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const daysArray: (Date | null)[] = [];

    // Add empty slots for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(year, month, i));
    }

    return daysArray;
  };

  // Check if a date is the same as the selected date
  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Calendar navigation functions
  const goToPreviousMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Handle date selection
  const handleDateClick = (date: Date): void => {
    const formattedDate = formatDate(date);
    setDateValue(formattedDate);
    onChange && onChange(formattedDate);
    setIsOpen(false);
  };

  // Calendar days
  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  // Selected date
  const selectedDate = parseDate(dateValue);

  // Format display value for input field
  const displayValue = selectedDate
    ? `${
        monthNames[selectedDate.getMonth()]
      } ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : "";

  return (
    <div className={`relative w-full ${className}`} ref={datePickerRef}>
      {/* Date input */}
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={displayValue}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        <div
          className="absolute top-0 right-0 px-3 py-2 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          {/* Calendar header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={goToPreviousMonth}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <div className="font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={goToNextMonth}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {dayNames.map((day, index) => (
              <div
                key={index}
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {daysInMonth.map((date, index) => (
              <div key={index} className="text-center">
                {date ? (
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isSameDay(date, selectedDate)
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            ))}
          </div>

          {/* Today button */}
          <div className="p-2 border-t border-gray-200">
            <button
              type="button"
              className="w-full py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 rounded-md"
              onClick={() => handleDateClick(new Date())}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
