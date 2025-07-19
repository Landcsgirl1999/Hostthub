'use client';

import MultiCalendar from '../components/MultiCalendar';

export default function MultiCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Multi-Property Calendar</h1>
        <p className="text-xl text-gray-600">View all your properties in a comprehensive timeline view</p>
      </div>
      
      <MultiCalendar />
    </div>
  );
} 