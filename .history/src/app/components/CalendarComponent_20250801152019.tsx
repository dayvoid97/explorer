// /app/components/WinsCalendar.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WinsCalendarProps {
  selectedDate: string
  onDateChange: (date: string) => void
  winCounts?: Record<string, number> // Optional: show win counts per date
}

export default function WinsCalendar({
  selectedDate,
  onDateChange,
  winCounts = {},
}: WinsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Initialize with selected date's month
  useEffect(() => {
    if (selectedDate && selectedDate !== 'Invalid Date') {
      const date = new Date(selectedDate)
      if (!isNaN(date.getTime())) {
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
      }
    }
  }, [selectedDate])

  const today = new Date()
  const selected = new Date(selectedDate)

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateString = clickedDate.toISOString().split('T')[0]
    onDateChange(dateString)
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return new Date(year, month, day).toISOString().split('T')[0]
  }

  // Generate calendar days
  const calendarDays = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-10" />
          }

          const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
          const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day)
          const isToday = currentDate.toDateString() === today.toDateString()
          const isSelected = currentDate.toDateString() === selected.toDateString()
          const isFuture = currentDate > today
          const winCount = winCounts[dateKey] || 0
          const hasWins = winCount > 0

          return (
            <button
              key={day}
              onClick={() => !isFuture && handleDateClick(day)}
              disabled={isFuture}
              className={`
                relative h-10 text-sm rounded-lg transition-all duration-200 flex items-center justify-center
                ${
                  isFuture
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
                }
                ${
                  isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-gray-700 dark:text-gray-300'
                }
                ${
                  isToday && !isSelected
                    ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/10'
                    : ''
                }
                ${
                  hasWins && !isSelected
                    ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
                    : ''
                }
              `}
              title={
                hasWins ? `${winCount} win${winCount !== 1 ? 's' : ''} on this date` : undefined
              }
            >
              {day}
              {hasWins && !isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>Selected date</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Has wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-400 rounded-full"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}
