'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, X, ExternalLink } from 'lucide-react';

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  attendees: Array<{ email: string }>;
  conferenceData?: any;
  htmlLink?: string;
  hasGoogleMeet?: boolean;
  joinUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  assignedProperties: string[];
}

export default function AdminSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GoogleCalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        // Fallback to mock user for demo
        const mockUser: User = {
          id: '1',
          name: 'Sierra Reynolds',
          email: 'sierra.reynolds@hostit.com',
          role: 'SUPER_ADMIN',
          isActive: true,
          assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse']
        };
        setCurrentUser(mockUser);
        console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN)');
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Fallback to mock user
      const mockUser: User = {
        id: '1',
        name: 'Sierra Reynolds',
        email: 'sierra.reynolds@hostit.com',
        role: 'SUPER_ADMIN',
        isActive: true,
        assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse']
      };
      setCurrentUser(mockUser);
      console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN) - fallback');
    }
  };

  // Fetch Google Calendar events for the current user
  const fetchGoogleEvents = async () => {
    if (!currentUser) return;
    
    try {
      // Get the first and last day of the current month being viewed
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      console.log('Fetching Google Calendar events for date range:', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        currentDate: currentDate.toISOString().split('T')[0],
        currentYear: currentDate.getFullYear()
      });

      const response = await fetch(`/api/calendar/events?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&userId=${currentUser.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setGoogleEvents(data.events || []);
        console.log('Fetched Google Calendar events for', currentUser.name, ':', data.events?.length || 0);
        
        // Log all events for debugging
        if (data.events && data.events.length > 0) {
          console.log('All fetched events:');
          data.events.forEach((event: any) => {
            console.log(`- ${event.summary} on ${new Date(event.start).toLocaleDateString()} at ${new Date(event.start).toLocaleTimeString()}`);
          });
        }
      } else {
        console.error('Failed to fetch Google Calendar events');
        setGoogleEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch Google Calendar events:', error);
      setGoogleEvents([]);
    }
  };

  // Mock data
  useEffect(() => {
    // Set current user immediately for demo
    const mockUser: User = {
      id: '1',
      name: 'Sierra Reynolds',
      email: 'sierra.reynolds@hostit.com',
      role: 'SUPER_ADMIN',
      isActive: true,
      assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse']
    };
    setCurrentUser(mockUser);
    console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN) - immediate');

    // Also try to fetch from API
    fetchCurrentUser();

    // Mock Google Calendar events
    const mockEvents: GoogleCalendarEvent[] = [
      {
        id: '1',
        summary: 'Consultation: John Doe',
        description: 'Consultation scheduled with John Doe (john@example.com).\nPreferred Method: video\nMessage: Interested in property management services',
        start: '2024-01-16T10:00:00.000Z',
        end: '2024-01-16T10:30:00.000Z',
        attendees: [{ email: 'john@example.com' }],
        hasGoogleMeet: true,
        joinUrl: 'https://meet.google.com/abc-defg-hij',
        htmlLink: 'https://calendar.google.com/event?eid=1'
      },
      {
        id: '2',
        summary: 'Consultation: Jane Smith',
        description: 'Consultation scheduled with Jane Smith (jane@example.com).\nPreferred Method: phone\nMessage: Looking to list 3 properties',
        start: '2024-01-18T14:00:00.000Z',
        end: '2024-01-18T14:30:00.000Z',
        attendees: [{ email: 'jane@example.com' }],
        hasGoogleMeet: false,
        htmlLink: 'https://calendar.google.com/event?eid=2'
      },
      {
        id: '3',
        summary: 'Team Meeting',
        description: 'Weekly team meeting to discuss property performance and upcoming tasks',
        start: '2024-01-19T09:00:00.000Z',
        end: '2024-01-19T10:00:00.000Z',
        attendees: [
          { email: 'sarah@hostit.com' },
          { email: 'mike@hostit.com' },
          { email: 'lisa@hostit.com' }
        ],
        hasGoogleMeet: true,
        joinUrl: 'https://meet.google.com/xyz-uvw-rst',
        htmlLink: 'https://calendar.google.com/event?eid=3'
      }
    ];

    setGoogleEvents(mockEvents);
    setLoading(false);
  }, []);

  // Fetch Google Calendar events when date changes
  useEffect(() => {
    if (!loading && currentUser) {
      fetchGoogleEvents();
    }
  }, [currentDate, loading, currentUser]);

  const getGoogleEventsForDate = (date: Date) => {
    return googleEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getGoogleEventsForTimeSlot = (date: Date, hour: number) => {
    return googleEvents.filter(event => {
      const eventDate = new Date(event.start);
      const eventHour = eventDate.getHours();
      const eventMinute = eventDate.getMinutes();
      
      // Check if event starts in this hour slot
      return eventDate.toDateString() === date.toDateString() && 
             eventHour === hour;
    });
  };

  const getEventType = (event: GoogleCalendarEvent) => {
    const summary = event.summary.toLowerCase();
    if (summary.includes('consultation') || summary.includes('hostithub')) {
      return 'consultation';
    } else if (summary.includes('meeting') || summary.includes('team')) {
      return 'meeting';
    } else {
      return 'other';
    }
  };

  const getEventColor = (event: GoogleCalendarEvent) => {
    const type = getEventType(event);
    switch (type) {
      case 'consultation': return 'bg-indigo-100 border-indigo-200 text-indigo-800';
      case 'meeting': return 'bg-purple-100 border-purple-200 text-purple-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Calendar navigation
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get week dates
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get month dates
  const getMonthDates = () => {
    const dates = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Schedule</h1>
            <p className="text-gray-600">Google Calendar integration for admin meetings and consultations</p>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousPeriod}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Today
              </button>
              
              <button
                onClick={goToNextPeriod}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {viewMode === 'week' 
                  ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                }
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'week'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'month'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-100 border border-indigo-200 rounded"></div>
              <span>Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
              <span>Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Other Events</span>
            </div>
          </div>
        </div>

        {/* Admin Schedule Calendar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Schedule (Google Calendar)
            </h3>
          </div>
          {viewMode === 'week' ? (
            <div className="grid grid-cols-8 gap-px bg-gray-200">
              {/* Header Row */}
              <div className="bg-gray-50 p-4"></div>
              {getWeekDates().map((date, index) => (
                <div key={index} className="bg-gray-50 p-4 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${
                    date.toDateString() === new Date().toDateString() 
                      ? 'text-purple-600' 
                      : 'text-gray-700'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
              
              {/* Time slots and calendar cells */}
              {getWeekDates().map((date, dateIndex) => (
                <div key={dateIndex} className="bg-white min-h-[600px] relative">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="h-6 border-b border-gray-100 relative">
                      {/* Google Calendar events for this time slot */}
                      {getGoogleEventsForTimeSlot(date, hour).map((event, eventIndex) => {
                        const eventStart = new Date(event.start);
                        const eventMinute = eventStart.getMinutes();
                        const topOffset = (eventMinute / 60) * 24; // Convert minutes to pixels
                        
                        return (
                          <div
                            key={eventIndex}
                            className={`absolute left-1 right-1 rounded px-1 text-xs truncate cursor-pointer ${getEventColor(event)}`}
                            style={{ 
                              top: `${topOffset}px`, 
                              height: '20px',
                              zIndex: 10
                            }}
                            onClick={() => setSelectedEvent(event)}
                            title={`${event.summary} - ${formatEventTime(event.start)}`}
                          >
                            {event.summary}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Month view header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-900">
                  {day}
                </div>
              ))}
              
              {/* Month view cells */}
              {getMonthDates().map((date, index) => (
                <div
                  key={index}
                  className={`bg-white min-h-[120px] p-2 relative ${
                    date.getMonth() !== currentDate.getMonth() ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    date.toDateString() === new Date().toDateString() 
                      ? 'text-purple-600' 
                      : date.getMonth() !== currentDate.getMonth() 
                        ? 'text-gray-400' 
                        : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Google Calendar events for this date */}
                  <div className="mt-1 space-y-1">
                    {getGoogleEventsForDate(date).slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`text-xs p-1 rounded cursor-pointer truncate ${getEventColor(event)}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.summary}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="text-gray-900">{selectedEvent.summary}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{selectedEvent.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <p className="text-gray-900">{new Date(selectedEvent.start).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <p className="text-gray-900">{new Date(selectedEvent.end).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <p className="text-gray-900">{getEventDuration(selectedEvent.start, selectedEvent.end)}</p>
              </div>
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attendees</label>
                  <div className="space-y-1">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <p key={index} className="text-gray-900">{attendee.email}</p>
                    ))}
                  </div>
                </div>
              )}
              {selectedEvent.hasGoogleMeet && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Google Meet</label>
                  <a
                    href={selectedEvent.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
              {selectedEvent.htmlLink && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Google Calendar</label>
                  <a
                    href={selectedEvent.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View in Calendar
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 