'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@hostit/ui';

interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  title: string;
}

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/calendar/check-availability?startDate=2025-07-07&endDate=2025-07-14');
      const data = await response.json();
      if (data.success && data.existingAppointments) {
        setEvents(data.existingAppointments.map((event: any, index: number) => ({
          id: `event-${index}`,
          start: event.start,
          end: event.end,
          title: event.title
        })));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const startTime = new Date(`${newEvent.date}T${newEvent.time}:00`);
      const endTime = new Date(startTime.getTime() + parseInt(newEvent.duration) * 60 * 1000);

      const response = await fetch('/api/calendar/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          title: newEvent.title
        }),
      });

      if (response.ok) {
        setNewEvent({ title: '', date: '', time: '', duration: '30' });
        loadEvents(); // Reload events
      }
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to remove this appointment?')) {
      setEvents(events.filter(event => event.id !== eventId));
      // In a real implementation, you'd make an API call to remove from calendar
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar Management</h1>
          <p className="text-gray-600">Manage your blocked appointment times for consultation scheduling</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add New Event */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-blue-600" />
              Add Blocked Time
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g., Property Inspection, Client Meeting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={addEvent}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Add Blocked Time
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Existing Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Blocked Times
            </h2>
            
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No blocked times scheduled</p>
                <p className="text-sm">Add blocked times to prevent double-booking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(event.start)} - {formatDateTime(event.end)}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeEvent(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">1. Add Blocked Times</h4>
              <p>Add appointments, meetings, or any time you're unavailable for consultations.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Automatic Blocking</h4>
              <p>These times will automatically be blocked in the consultation scheduling form.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Prevent Double-Booking</h4>
              <p>Visitors won't be able to book consultations during your blocked times.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 