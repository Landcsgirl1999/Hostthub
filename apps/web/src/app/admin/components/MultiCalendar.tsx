'use client';

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestCount: number;
  type: 'reservation' | 'hold' | 'maintenance';
  status: 'confirmed' | 'pending' | 'cancelled';
  amount?: number;
  notes?: string;
  reservationType?: 'guest' | 'homeowner' | 'friends_family';
  cleaningCostCoverage?: 'homeowner' | 'guest';
  chargeNightlyRate?: boolean;
  chargeInsurance?: boolean;
  insuranceAmount?: number;
  nightlyRateAmount?: number;
  email?: string;
  phoneNumber?: string;
  channel?: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
}

// Channel Icon Component
const ChannelIcon: React.FC<{ channel: string; className?: string }> = ({ channel, className = '' }) => {
  const getChannelIcon = (channelName: string) => {
    const channelLower = channelName.toLowerCase();
    
    switch (channelLower) {
      case 'airbnb':
        return (
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
            <path d="M12.0001 2C13.1046 2 14.0001 2.89543 14.0001 4C14.0001 5.10457 13.1046 6 12.0001 6C10.8955 6 10.0001 5.10457 10.0001 4C10.0001 2.89543 10.8955 2 12.0001 2Z"/>
            <path d="M12.0001 8C13.1046 8 14.0001 8.89543 14.0001 10C14.0001 11.1046 13.1046 12 12.0001 12C10.8955 12 10.0001 11.1046 10.0001 10C10.0001 8.89543 10.8955 8 12.0001 8Z"/>
            <path d="M12.0001 14C13.1046 14 14.0001 14.8954 14.0001 16C14.0001 17.1046 13.1046 18 12.0001 18C10.8955 18 10.0001 17.1046 10.0001 16C10.0001 14.8954 10.8955 14 12.0001 14Z"/>
            <path d="M4.0001 8C5.10467 8 6.0001 8.89543 6.0001 10C6.0001 11.1046 5.10467 12 4.0001 12C2.89553 12 2.0001 11.1046 2.0001 10C2.0001 8.89543 2.89553 8 4.0001 8Z"/>
            <path d="M20.0001 8C21.1047 8 22.0001 8.89543 22.0001 10C22.0001 11.1046 21.1047 12 20.0001 12C18.8955 12 18.0001 11.1046 18.0001 10C18.0001 8.89543 18.8955 8 20.0001 8Z"/>
          </svg>
        );
      
      case 'booking.com':
        return (
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"/>
            <path d="M5 15L5.5 17L8 17.5L5.5 18L5 20L4.5 18L2 17.5L4.5 17L5 15Z"/>
          </svg>
        );
      
      case 'vrbo':
        return (
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
            <path d="M3 3H21V5H3V3Z"/>
            <path d="M3 7H21V9H3V7Z"/>
            <path d="M3 11H21V13H3V11Z"/>
            <path d="M3 15H21V17H3V15Z"/>
            <path d="M3 19H21V21H3V19Z"/>
          </svg>
        );
      
      case 'expedia':
        return (
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"/>
          </svg>
        );
      
      case 'houfy':
        return (
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"/>
            <path d="M5 15L5.5 17L8 17.5L5.5 18L5 20L4.5 18L2 17.5L4.5 17L5 15Z"/>
          </svg>
        );
      
      case 'glamping.com':
        return (
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            <path d="M3 15L3.5 17L6 17.5L3.5 18L3 20L2.5 18L0 17.5L2.5 17L3 15Z"/>
          </svg>
        );
      
      case 'direct':
      default:
        return (
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"/>
            <path d="M5 15L5.5 17L8 17.5L5.5 18L5 20L4.5 18L2 17.5L4.5 17L5 15Z"/>
          </svg>
        );
    }
  };

  return (
    <div className="absolute top-1 left-1 z-10">
      <div className="bg-white rounded-full p-1 shadow-md border border-gray-200">
        {getChannelIcon(channel)}
      </div>
    </div>
  );
};

const MultiCalendar: React.FC = () => {
  // Add global error handler to prevent validation errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('pattern') || event.message.includes('validation')) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPropertyForEvent, setSelectedPropertyForEvent] = useState<string>('');
  const [events, setEvents] = useState<CalendarEvent[]>([
      {
        id: '1',
      title: 'Family Vacation',
      startDate: '2025-07-08',
      endDate: '2025-07-12',
      propertyId: '1',
      propertyName: 'Sunset Villa',
      guestName: 'John Smith',
      guestCount: 4,
        type: 'reservation',
        status: 'confirmed',
      amount: 1200,
      notes: 'Early check-in requested',
      insuranceAmount: 60,
      email: 'john.smith@email.com',
      phoneNumber: '(555) 123-4567',
      channel: 'airbnb'
      },
      {
        id: '2',
      title: 'Weekend Getaway',
      startDate: '2025-07-10',
      endDate: '2025-07-13',
      propertyId: '2',
      propertyName: 'Ocean View Condo',
      guestName: 'Sarah Johnson',
      guestCount: 2,
      type: 'reservation',
      status: 'confirmed',
      amount: 800,
      insuranceAmount: 60,
      email: 'sarah.johnson@email.com',
      phoneNumber: '(555) 987-6543',
      channel: 'booking.com'
      },
      {
        id: '3',
      title: 'Family Vacation',
      startDate: '2025-07-15',
      endDate: '2025-07-22',
      propertyId: '1',
      propertyName: 'Beach House',
      guestName: 'Sarah Johnson',
      guestCount: 5,
        type: 'reservation',
        status: 'confirmed',
      amount: 1200,
      notes: 'Family vacation - 7 nights',
      reservationType: 'friends_family',
      cleaningCostCoverage: 'homeowner',
      chargeNightlyRate: true,
      chargeInsurance: true,
      insuranceAmount: 60,
      nightlyRateAmount: 150,
      channel: 'vrbo'
    },
      {
        id: '4',
      title: 'Owner Stay',
      startDate: '2025-07-18',
      endDate: '2025-07-20',
      propertyId: '1',
      propertyName: 'Beach House',
      guestName: 'John Smith',
      guestCount: 1,
      type: 'reservation',
      status: 'confirmed',
      amount: 0,
      notes: 'Personal vacation',
      reservationType: 'homeowner',
      cleaningCostCoverage: 'homeowner',
      chargeNightlyRate: false,
      chargeInsurance: false,
      channel: 'direct'
      },
      {
        id: '5',
      title: 'Maintenance Block',
      startDate: '2025-07-10',
      endDate: '2025-07-12',
      propertyId: '1',
      propertyName: 'Beach House',
      guestName: 'Maintenance Team',
      guestCount: 0,
      type: 'maintenance',
      status: 'confirmed',
      notes: 'HVAC system upgrade'
    },
      {
        id: '6',
      title: 'Potential Client Hold',
      startDate: '2025-07-11',
      endDate: '2025-07-14',
      propertyId: '1',
      propertyName: 'Sunset Villa',
      guestName: 'Corporate client considering booking',
      guestCount: 0,
      type: 'hold',
      status: 'pending',
      notes: 'Waiting for contract approval'
      },
      {
        id: '7',
      title: 'Plumbing Repair',
      startDate: '2025-07-16',
      endDate: '2025-07-18',
      propertyId: '2',
      propertyName: 'Ocean View Condo',
      guestName: 'Emergency plumbing repair',
      guestCount: 0,
      type: 'maintenance',
      status: 'confirmed',
      notes: 'Leaking pipe in kitchen'
    },
      {
        id: '8',
      title: 'Annual Family Vacation',
      startDate: '2025-07-22',
      endDate: '2025-07-26',
      propertyId: '1',
      propertyName: 'Sunset Villa',
      guestName: 'Owner family',
      guestCount: 3,
        type: 'reservation',
        status: 'confirmed',
      notes: 'Annual family vacation',
      reservationType: 'homeowner',
      cleaningCostCoverage: 'homeowner',
      chargeNightlyRate: false,
      chargeInsurance: false,
      channel: 'direct'
      },
      {
        id: '9',
      title: 'Friends & Family Reservation',
      startDate: '2025-07-30',
      endDate: '2025-08-02',
      propertyId: '1',
      propertyName: 'Sunset Villa',
      guestName: 'Sarah & Mike Johnson',
      guestCount: 2,
      type: 'reservation',
      status: 'confirmed',
      amount: 450,
      notes: 'College friends visiting',
      reservationType: 'friends_family',
      cleaningCostCoverage: 'homeowner',
      chargeNightlyRate: true,
      chargeInsurance: false,
      insuranceAmount: 60,
      channel: 'expedia'
    },
      {
        id: '10',
      title: 'Weekend Getaway',
      startDate: '2025-07-25',
      endDate: '2025-07-27',
      propertyId: '2',
      propertyName: 'Mountain Cabin',
      guestName: 'Mike Wilson',
      guestCount: 6,
        type: 'reservation',
        status: 'confirmed',
      amount: 300,
      notes: 'Weekend trip with friends',
      reservationType: 'friends_family',
      cleaningCostCoverage: 'guest',
      chargeNightlyRate: true,
      chargeInsurance: true,
      insuranceAmount: 60,
      nightlyRateAmount: 200,
      channel: 'houfy'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'reservation' as 'reservation' | 'hold' | 'maintenance',
    guestName: '',
    guestCount: 1,
    startDate: '',
    endDate: '',
    notes: '',
    amount: '',
    reservationType: 'guest' as 'homeowner' | 'friends_family' | 'guest',
    cleaningCostCoverage: 'homeowner' as 'homeowner' | 'guest',
    chargeNightlyRate: false,
    chargeInsurance: false,
    insuranceAmount: 60,
    nightlyRateAmount: '',
    email: '',
    phoneNumber: '',
    channel: 'direct'
  });

  // Mock data
  const userProperties: Property[] = [
    { id: '1', name: 'Sunset Villa', location: 'Miami Beach, FL', type: 'Villa' },
    { id: '2', name: 'Ocean View Condo', location: 'San Diego, CA', type: 'Condo' },
    { id: '3', name: 'Mountain Cabin', location: 'Aspen, CO', type: 'Cabin' },
    { id: '4', name: 'City Loft', location: 'New York, NY', type: 'Apartment' },
    { id: '5', name: 'Beach House', location: 'Malibu, CA', type: 'House' },
  ];

  // Set default selected property for monthly view
  useEffect(() => {
    if (view === 'month' && !selectedProperty && userProperties.length > 0) {
      setSelectedProperty(userProperties[0].id);
    }
  }, [view, selectedProperty, userProperties]);

  // Get exactly 15 days for the calendar
  const getScrollableDays = (date: Date, view: 'week' | 'month') => {
    const days = [];
    const startDate = view === 'week' 
      ? startOfWeek(date)
      : startOfMonth(date);
    
    if (view === 'week') {
      // Show exactly 15 days for week view, starting from the current startDate
      const totalDays = 15;
      for (let i = 0; i < totalDays; i++) {
        days.push(addDays(startDate, i));
      }
    } else {
      // For monthly view, get the full month grid
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
      // Add empty days for padding at the beginning
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
      }
    }
    
    return days;
  };

  // Navigation handlers already allow unlimited prev/next, so no changes needed there.

  const scrollableDays = getScrollableDays(currentDate, view);

  // Get properties to display based on view
  const getDisplayProperties = () => {
    if (view === 'week') {
      return userProperties;
    } else {
      // Monthly view: only show selected property
      return userProperties.filter(prop => prop.id === selectedProperty);
    }
  };

  const displayProperties = getDisplayProperties();

  const handleDateClick = (date: Date, propertyName: string) => {
    // Check if the date is blocked by any events
    const propertyId = selectedProperty || userProperties[0].id;
    const blockingEvents = events.filter(event => {
      if (event.propertyId !== propertyId) return false;
      
      const blockingTypes = ['reservation', 'hold', 'maintenance'];
      if (!blockingTypes.includes(event.type)) return false;
      
      if (event.status === 'cancelled') return false;
      
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      return date >= eventStart && date <= eventEnd;
    });

    if (blockingEvents.length > 0) {
      const eventTypes = blockingEvents.map(e => e.type).join(', ');
      const eventNames = blockingEvents.map(e => e.type === 'hold' ? e.guestName : e.title).join(', ');
      alert(`This date is blocked by existing ${eventTypes} events: ${eventNames}. Please choose a different date.`);
      return;
    }

    setSelectedDate(date);
    setSelectedPropertyForEvent(propertyName);
    setShowAddEventModal(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setIsEditMode(false);
    setEditingEvent(null);
  };

  const enterEditMode = () => {
    if (selectedEvent) {
      setIsEditMode(true);
      setEditingEvent({ ...selectedEvent });
    }
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setEditingEvent(null);
  };

  const handleEditEvent = () => {
    // Prevent any validation errors
    try {
      if (!editingEvent) return;

      // Validate required fields
      if (editingEvent.type === 'reservation' || editingEvent.type === 'hold' || editingEvent.type === 'maintenance') {
        if (!editingEvent.guestName || !editingEvent.startDate || !editingEvent.endDate) {
          alert('Please fill in all required fields');
          return;
        }
      }

      // Check for conflicts (excluding the current event being edited)
      const conflicts = checkForConflicts(editingEvent.startDate, editingEvent.endDate, editingEvent.propertyId, editingEvent.id);
      
      if (conflicts.length > 0) {
        const conflictTypes = conflicts.map(c => c.type).join(', ');
        const conflictDates = conflicts.map(c => 
          `${format(new Date(c.startDate), 'MMM dd')} - ${format(new Date(c.endDate), 'MMM dd')}`
        ).join(', ');
        
        alert(`Booking conflict detected! There are existing ${conflictTypes} events on ${conflictDates}. Please choose different dates.`);
        return;
      }

      // Update the event in the events array
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === editingEvent.id ? editingEvent : event
        )
      );

      // Exit edit mode and close modal
      exitEditMode();
      closeEventModal();
    } catch (error) {
      console.error('Error editing event:', error);
      alert('An error occurred while editing the event. Please try again.');
    }
  };

  const closeAddEventModal = () => {
    setShowAddEventModal(false);
    setSelectedDate(null);
    setSelectedPropertyForEvent('');
    setNewEvent({
      title: '',
      type: 'reservation',
      guestName: '',
      guestCount: 1,
      startDate: '',
      endDate: '',
      notes: '',
      amount: '',
      reservationType: 'guest',
      cleaningCostCoverage: 'homeowner',
      chargeNightlyRate: false,
      chargeInsurance: false,
      insuranceAmount: undefined,
      nightlyRateAmount: '',
      email: '',
      phoneNumber: '',
      channel: 'direct'
    });
  };

  // Helper function to check for booking conflicts
  const checkForConflicts = (startDate: string, endDate: string, propertyId: string, excludeEventId?: string): CalendarEvent[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return events.filter(event => {
      // Skip the event being edited (if any)
      if (excludeEventId && event.id === excludeEventId) return false;
      
      // Only check conflicts for the same property
      if (event.propertyId !== propertyId) return false;
      
      // All event types block bookings: reservations, holds, and maintenance
      const blockingTypes = ['reservation', 'hold', 'maintenance'];
      if (!blockingTypes.includes(event.type)) return false;
      
      // Only check confirmed and pending events (cancelled events don't block)
      if (event.status === 'cancelled') return false;
      
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Check for date overlap (inclusive dates)
      return (start <= eventEnd && end >= eventStart);
    });
  };

  const handleAddEvent = () => {
    // Prevent any validation errors
    try {
      // Validate required fields based on event type
      if (newEvent.type === 'reservation') {
        if (!newEvent.guestName || !newEvent.startDate || !newEvent.endDate) {
          alert('Please fill in all required fields for reservation');
          return;
        }
      } else if (newEvent.type === 'hold') {
        if (!newEvent.guestName || !newEvent.startDate || !newEvent.endDate) {
          alert('Please fill in all required fields for hold');
          return;
        }
      } else if (newEvent.type === 'maintenance') {
        if (!newEvent.guestName || !newEvent.startDate || !newEvent.endDate) {
          alert('Please fill in all required fields for maintenance');
          return;
        }
    } else {
        if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
          alert('Please fill in all required fields');
          return;
        }
      }

      const propertyId = selectedProperty || userProperties[0].id;
      
      // Check for conflicts
      const conflicts = checkForConflicts(newEvent.startDate, newEvent.endDate, propertyId);
      
      if (conflicts.length > 0) {
        const conflictTypes = conflicts.map(c => c.type).join(', ');
        const conflictDates = conflicts.map(c => 
          `${format(new Date(c.startDate), 'MMM dd')} - ${format(new Date(c.endDate), 'MMM dd')}`
        ).join(', ');
        
        alert(`Booking conflict detected! There are existing ${conflictTypes} events on ${conflictDates}. Please choose different dates.`);
        return;
      }

      const newEventData: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.type === 'hold' ? newEvent.guestName : (newEvent.title || 'New Event'),
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        propertyId: propertyId,
        propertyName: selectedPropertyForEvent,
        guestName: newEvent.guestName,
        guestCount: newEvent.guestCount,
        type: newEvent.type,
        status: 'confirmed',
        amount: newEvent.amount ? parseFloat(newEvent.amount) : undefined,
        notes: newEvent.notes,
        reservationType: newEvent.type === 'reservation' ? newEvent.reservationType : undefined,
        cleaningCostCoverage: newEvent.type === 'reservation' ? newEvent.cleaningCostCoverage : undefined,
        chargeNightlyRate: newEvent.chargeNightlyRate,
        chargeInsurance: newEvent.chargeInsurance,
        insuranceAmount: newEvent.type === 'reservation' && newEvent.reservationType !== 'homeowner' ? 60 : undefined,
        nightlyRateAmount: newEvent.type === 'reservation' && newEvent.chargeNightlyRate ? parseFloat(newEvent.nightlyRateAmount || '0') : undefined,
        email: newEvent.email,
        phoneNumber: newEvent.phoneNumber,
        channel: newEvent.channel
      };

      // In a real app, you would save this to your backend
      console.log('New event created:', newEventData);
      
      // Close modal and reset form
      closeAddEventModal();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('An error occurred while adding the event. Please try again.');
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'week') {
      setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Helper function to get the number of days between two dates (inclusive)
  const getDateSpan = (start: Date, end: Date) => {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Render calendar based on view type
  const renderCalendar = () => {
    if (view === 'week') {
      return (
        <div className="relative w-full">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: '70vh' }}>
            <div className="min-w-full">
              {/* Sticky Header Row */}
              <div className="grid gap-1 mb-6 sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" 
                   style={{ 
                     gridTemplateColumns: `minmax(200px, 1fr) repeat(${scrollableDays.length}, minmax(80px, 1fr))` 
                   }}>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center space-x-3 sticky left-0 z-20 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-200 border-r border-gray-100 shadow-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
                  <span className="font-semibold text-gray-800">Properties</span>
                </div>
                {scrollableDays.map((day, index) => (
                  <div
                    key={index}
                    className="p-3 text-center border-r border-gray-50 last:border-r-0 hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-lg font-bold mt-1 ${
                      isSameDay(day, new Date()) 
                        ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-lg' 
                        : 'text-gray-800'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(day, 'MMM')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Property Rows */}
              {displayProperties.map((property, propertyIndex) => (
                <div key={property.id} className="group mb-2">
                  <div className="grid gap-1" 
                       style={{ 
                         gridTemplateColumns: `minmax(200px, 1fr) repeat(${scrollableDays.length}, minmax(80px, 1fr))` 
                       }}>
                    {/* Property Name Column - Sticky */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center space-x-3 sticky left-0 z-20 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-200 border-r border-gray-100 shadow-sm">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
                      <div>
                        <div className="font-semibold text-gray-800">{property.name}</div>
                        <div className="text-xs text-gray-500">{property.location}</div>
                      </div>
                    </div>

                    {/* Date Columns */}
                    {scrollableDays.map((day, dayIndex) => {
                      const dayEvents = events.filter(event => 
                        event.propertyId === property.id && 
                        isSameDay(new Date(event.startDate), day)
                      );

                      // Check if this date has any blocking events
                      const blockingEvents = events.filter(event => {
                        if (event.propertyId !== property.id) return false;
                        
                        // All event types block bookings: reservations, holds, and maintenance
                        const blockingTypes = ['reservation', 'hold', 'maintenance'];
                        if (!blockingTypes.includes(event.type)) return false;
                        
                        // Only confirmed and pending events block (cancelled events don't block)
                        if (event.status === 'cancelled') return false;
                        
                        const eventStart = new Date(event.startDate);
                        const eventEnd = new Date(event.endDate);
                        
                        // Check if the current day falls within the event range (inclusive)
                        return day >= eventStart && day <= eventEnd;
                      });

                      const isBlocked = blockingEvents.length > 0;

                      return (
                        <div
                          key={dayIndex}
                          className={`relative h-20 p-2 border-r border-gray-50 last:border-r-0 transition-all duration-200 cursor-pointer rounded-lg mx-1 ${
                            isBlocked 
                              ? 'bg-red-50/50 hover:bg-red-100/50 cursor-not-allowed' 
                              : 'hover:bg-gray-50/30'
                          }`}
                          onClick={() => handleDateClick(day, property.name)}
                        >
                          {/* Date Number */}
                          <div className={`absolute top-2 left-2 text-xs font-semibold ${
                            isSameDay(day, new Date()) 
                              ? 'text-blue-600 font-bold' 
                              : isBlocked 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {format(day, 'd')}
                          </div>

                          {/* Blocked indicator */}
                          {isBlocked && (
                            <div className="absolute top-1 right-1 flex space-x-1">
                              {blockingEvents.map((event, idx) => (
                                <div
                                  key={idx}
                                  className={`w-2 h-2 rounded-full opacity-75 ${
                                    event.type === 'reservation' ? 'bg-green-500' :
                                    event.type === 'hold' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                  }`}
                                  title={`${event.type}: ${event.type === 'hold' ? event.guestName : event.title}`}
                                ></div>
                              ))}
                            </div>
                          )}

                          {/* Single day events */}
                          {dayEvents.map((event, eventIndex) => (
                            <div
                              key={event.id}
                              className={`absolute inset-1 rounded-lg p-2 text-xs font-medium text-white cursor-pointer transition-all duration-200 hover:scale-105 shadow-md ${
                                event.type === 'reservation' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                event.type === 'hold' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                                'bg-gradient-to-r from-blue-500 to-indigo-600'
                              }`}
                              style={{ top: '18px' }} // Push events down to make room for date
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                              title={`${event.title} - ${event.guestName}`}
                            >
                              {/* Channel Icon for Reservations */}
                              {event.type === 'reservation' && event.channel && (
                                <ChannelIcon channel={event.channel} className="text-gray-700" />
                              )}
                              
                              {/* Guest Picture and Name for Reservations */}
                              {event.type === 'reservation' ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="truncate font-semibold text-white">
                                      {event.guestName}
                                    </div>
                                    <div className="text-xs opacity-90">
                                      {event.reservationType === 'guest' ? 'Guest' : 
                                       event.reservationType === 'homeowner' ? 'Homeowner' : 
                                       'Friends & Family'}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="truncate font-semibold">
                                    {event.type === 'hold' ? event.guestName : event.title}
                                  </div>
                                  <div className="text-xs opacity-90">
                                    {event.type === 'hold' ? event.notes || 'Hold' : event.guestName}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Multi-day events: Reservations and Holds */}
                          {events
                            .filter(event => 
                              event.propertyId === property.id && 
                              (event.type === 'reservation' || event.type === 'hold') &&
                              new Date(event.startDate) <= day && 
                              new Date(event.endDate) >= day
                            )
                            .map((event, eventIndex) => {
                              const eventStart = new Date(event.startDate);
                              const eventEnd = new Date(event.endDate);
                              const isFirstDay = isSameDay(eventStart, day);
                              const spanDays = getDateSpan(eventStart, eventEnd);
                              
                              // Only render on the first day of the event to avoid duplicates
                              if (!isFirstDay) return null;

                              // Calculate how many days this event spans within the visible calendar
                              const visibleStart = scrollableDays[0];
                              const visibleEnd = scrollableDays[scrollableDays.length - 1];
                              
                              // Find the actual start and end positions within the visible range
                              const actualStart = eventStart < visibleStart ? visibleStart : eventStart;
                              const actualEnd = eventEnd > visibleEnd ? visibleEnd : eventEnd;
                              
                              // Calculate the position and width
                              const startIndex = scrollableDays.findIndex(d => isSameDay(d, actualStart));
                              const endIndex = scrollableDays.findIndex(d => isSameDay(d, actualEnd));
                              const visibleSpanDays = endIndex - startIndex + 1;
                              
                              // Color palette for reservations and holds
                              const colors = event.type === 'reservation'
                                ? [
                                    'from-teal-500 to-cyan-600',
                                    'from-blue-500 to-indigo-600',
                                    'from-orange-500 to-amber-600',
                                    'from-pink-500 to-rose-600',
                                    'from-green-500 to-emerald-600',
                                    'from-purple-500 to-fuchsia-600',
                                  ]
                                : [
                                    'from-yellow-500 to-amber-600',
                                    'from-yellow-400 to-amber-500',
                                    'from-yellow-600 to-amber-700',
                                  ];
                              const colorClass = colors[eventIndex % colors.length];

                              // Guest initials or Hold initials
                              const initials = event.guestName
                                ? event.guestName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                                : '?';

                              return (
                                <div
                                  key={event.id}
                                  className={`absolute top-1 bottom-1 p-0.5 flex items-center cursor-pointer transition-all duration-200 shadow-lg hover:brightness-105 z-20 bg-gradient-to-r ${colorClass}`}
                                  style={{
                                    left: '4px',
                                    right: '4px',
                                    width: `calc(${visibleSpanDays} * 100% - 8px)`,
                                    borderTopLeftRadius: '12px',
                                    borderBottomLeftRadius: '12px',
                                    borderTopRightRadius: visibleSpanDays === 1 ? '12px' : '0',
                                    borderBottomRightRadius: visibleSpanDays === 1 ? '12px' : '0',
                                    ...(visibleSpanDays > 1 && {
                                      borderTopRightRadius: '12px',
                                      borderBottomRightRadius: '12px',
                                    })
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                  }}
                                  title={event.type === 'reservation'
                                    ? `${event.guestName} • ${event.guestCount || 1} guest${event.guestCount === 1 ? '' : 's'}`
                                    : event.guestName || event.title}
                                >
                                  {/* Channel Icon for Reservations */}
                                  {event.type === 'reservation' && event.channel && (
                                    <ChannelIcon channel={event.channel} className="text-gray-700" />
                                  )}
                                  <div className="flex items-center px-3 py-1 w-full min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white shadow-sm">
                                      <span className="text-sm font-bold text-gray-700">{initials}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="truncate font-semibold text-white text-base">
                                        {event.type === 'reservation'
                                          ? `${event.guestName}${event.guestCount ? ` • ${event.guestCount} guest${event.guestCount === 1 ? '' : 's'}` : ''}`
                                          : event.guestName || event.title}
                                      </div>
                                      {event.type === 'hold' && (
                                        <div className="text-xs opacity-90 text-white">
                                          {event.notes || 'Hold'}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // Monthly view - traditional calendar grid
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeks = [];
      for (let i = 0; i < scrollableDays.length; i += 7) {
        weeks.push(scrollableDays.slice(i, i + 7));
      }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-px bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            {weekDays.map((day, index) => (
              <div key={index} className="p-4 text-center bg-white">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{day}</div>
        </div>
            ))}
      </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100">
            {scrollableDays.map((day, index) => {
              if (!day) {
                return (
                  <div key={index} className="h-40 bg-gray-50"></div>
                );
              }

              const dayEvents = events.filter(event => 
                event.propertyId === selectedProperty && 
                isSameDay(new Date(event.startDate), day)
              );

              // Check if this date has any blocking events
              const blockingEvents = events.filter(event => {
                if (event.propertyId !== selectedProperty) return false;
                
                // All event types block bookings: reservations, holds, and maintenance
                const blockingTypes = ['reservation', 'hold', 'maintenance'];
                if (!blockingTypes.includes(event.type)) return false;
                
                // Only confirmed and pending events block (cancelled events don't block)
                if (event.status === 'cancelled') return false;
                
                const eventStart = new Date(event.startDate);
                const eventEnd = new Date(event.endDate);
                
                // Check if the current day falls within the event range (inclusive)
                return day >= eventStart && day <= eventEnd;
              });

              const isBlocked = blockingEvents.length > 0;

  return (
                <div
                  key={index}
                  className={`relative h-40 p-3 bg-white hover:bg-gray-50/80 transition-all duration-200 cursor-pointer group ${
                    isSameDay(day, new Date()) ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/50' : ''
                  } ${isBlocked ? 'bg-red-50/50 hover:bg-red-100/50 cursor-not-allowed' : ''}`}
                  onClick={() => handleDateClick(day, displayProperties[0]?.name || '')}
                >
                  {/* Date number */}
                  <div className={`text-sm font-bold mb-2 ${
                    isSameDay(day, new Date()) 
                      ? 'text-blue-600' 
                      : 'text-gray-800'
                  }`}>
                    {format(day, 'd')}
        </div>
        
                  {/* Blocked indicator */}
                  {isBlocked && (
                    <div className="absolute top-1 right-1 flex space-x-1">
                      {blockingEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full opacity-75 ${
                            event.type === 'reservation' ? 'bg-green-500' :
                            event.type === 'hold' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          title={`${event.type}: ${event.type === 'hold' ? event.guestName : event.title}`}
                        ></div>
                      ))}
                    </div>
                  )}

                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-105 shadow-sm relative ${
                          event.type === 'reservation' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          event.type === 'hold' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                          'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        title={`${event.title} - ${event.guestName}`}
                      >
                        {/* Channel Icon for Reservations */}
                        {event.type === 'reservation' && event.channel && (
                          <ChannelIcon channel={event.channel} className="text-gray-700" />
                        )}
                        
                        {/* Guest Picture and Name for Reservations */}
                        {event.type === 'reservation' ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-semibold text-white">
                                {event.guestName}
                              </div>
                              <div className="text-xs opacity-90">
                                {event.reservationType === 'guest' ? 'Guest' : 
                                 event.reservationType === 'homeowner' ? 'Homeowner' : 
                                 'Friends & Family'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="truncate">
                              {event.type === 'hold' ? event.guestName : event.title}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-lg">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
          </div>
          
                  {/* Multi-day events that start on this day: Reservations and Holds */}
                  {events
                    .filter(event => 
                      event.propertyId === selectedProperty && 
                      (event.type === 'reservation' || event.type === 'hold') &&
                      isSameDay(new Date(event.startDate), day) &&
                      !isSameDay(new Date(event.startDate), new Date(event.endDate))
                    )
                    .map((event, eventIndex) => {
                      const eventStart = new Date(event.startDate);
                      const eventEnd = new Date(event.endDate);
                      const spanDays = getDateSpan(eventStart, eventEnd);

                      // Calculate how many days this event spans within the visible calendar
                      const visibleStart = scrollableDays[0];
                      const visibleEnd = scrollableDays[scrollableDays.length - 1];
                      
                      // Find the actual start and end positions within the visible range
                      const actualStart = eventStart < visibleStart ? visibleStart : eventStart;
                      const actualEnd = eventEnd > visibleEnd ? visibleEnd : eventEnd;
                      
                      // Calculate the position and width
                      const startIndex = scrollableDays.findIndex(d => isSameDay(d, actualStart));
                      const endIndex = scrollableDays.findIndex(d => isSameDay(d, actualEnd));
                      const visibleSpanDays = endIndex - startIndex + 1;

                      // Color palette for reservations and holds
                      const colors = event.type === 'reservation'
                        ? [
                            'from-teal-500 to-cyan-600',
                            'from-blue-500 to-indigo-600',
                            'from-orange-500 to-amber-600',
                            'from-pink-500 to-rose-600',
                            'from-green-500 to-emerald-600',
                            'from-purple-500 to-fuchsia-600',
                          ]
                        : [
                            'from-yellow-500 to-amber-600',
                            'from-yellow-400 to-amber-500',
                            'from-yellow-600 to-amber-700',
                          ];
                      const colorClass = colors[eventIndex % colors.length];

                      // Guest initials or Hold initials
                      const initials = event.guestName
                        ? event.guestName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                        : '?';

                      return (
                        <div
                          key={event.id}
                          className={`absolute top-10 left-2 right-2 p-0.5 flex items-center cursor-pointer transition-all duration-200 shadow-lg hover:brightness-105 z-20 bg-gradient-to-r ${colorClass}`}
                          style={{
                            width: `calc(${visibleSpanDays} * 100% - 16px)`,
                            borderTopLeftRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            borderTopRightRadius: visibleSpanDays === 1 ? '12px' : '0',
                            borderBottomRightRadius: visibleSpanDays === 1 ? '12px' : '0',
                            ...(visibleSpanDays > 1 && {
                              borderTopRightRadius: '12px',
                              borderBottomRightRadius: '12px',
                            })
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                          title={event.type === 'reservation'
                            ? `${event.guestName} • ${event.guestCount || 1} guest${event.guestCount === 1 ? '' : 's'}`
                            : event.guestName || event.title}
                        >
                          {/* Channel Icon for Reservations */}
                          {event.type === 'reservation' && event.channel && (
                            <ChannelIcon channel={event.channel} className="text-gray-700" />
                          )}
                          <div className="flex items-center px-3 py-1 w-full min-w-0">
                            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white shadow-sm">
                              <span className="text-sm font-bold text-gray-700">{initials}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-semibold text-white text-base">
                                {event.type === 'reservation'
                                  ? `${event.guestName}${event.guestCount ? ` • ${event.guestCount} guest${event.guestCount === 1 ? '' : 's'}` : ''}`
                                  : event.guestName || event.title}
                              </div>
                              {event.type === 'hold' && (
                                <div className="text-xs opacity-90 text-white">
                                  {event.notes || 'Hold'}
                                </div>
                              )}
                            </div>
                          </div>
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
  };

  // Mock user role - in a real app this would come from authentication context
  const [userRole, setUserRole] = useState<'guest' | 'homeowner' | 'manager' | 'super_admin'>('homeowner');

  // Helper function to check if user can cancel a reservation
  const canCancelReservation = (event: CalendarEvent): boolean => {
    if (event.type !== 'reservation') return true; // Can cancel non-reservations
    
    switch (userRole) {
      case 'guest':
      case 'manager':
      case 'super_admin':
        // Can cancel all reservation types
        return true;
      case 'homeowner':
        // Can only cancel homeowner and friends_family reservations
        return event.reservationType === 'homeowner' || event.reservationType === 'friends_family';
      default:
        return false;
    }
  };

  // Helper function to get cancellation restriction message
  const getCancellationRestrictionMessage = (event: CalendarEvent): string => {
    if (event.type !== 'reservation') return '';
    
    switch (userRole) {
      case 'homeowner':
        if (event.reservationType === 'guest') {
          return 'Homeowners cannot cancel guest reservations. Only guests, managers, and super admins can cancel guest reservations.';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Date and Navigation */}
            <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
            >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            
            <button
              onClick={goToToday}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
            >
              Today
            </button>
            </div>

            {/* Center - Date Display */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {format(currentDate, 'MMMM yyyy')}
              </h1>
            </div>

            {/* Right side - View Toggle and Property Selector */}
            <div className="flex items-center space-x-4">
              {/* Calendar Legend */}
              <div className="flex items-center space-x-4 text-xs">
                <span className="font-semibold text-gray-700">Legend:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Reservation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Hold</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Maintenance</span>
                </div>
              </div>

              {/* Property Selector for Monthly View */}
              {view === 'month' && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-semibold text-gray-700">Property:</label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  >
                    {userProperties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
            <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    view === 'week'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    view === 'month'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Month
            </button>
          </div>
        </div>
      </div>

          {/* Information Message */}
          <div className="pb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Double Booking Prevention</p>
                  <p>All event types (Reservations, Holds, and Maintenance) block double bookings. Dates with colored indicators are blocked and cannot have new events added. Cancelled events do not block bookings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Legend */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Calendar Legend</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Reservation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Hold</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Block</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Blocked Date (No Double Booking)</span>
            </div>
          </div>
        </div>
        
        {renderCalendar()}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-200 scale-100 flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Event' : (selectedEvent.type === 'hold' ? selectedEvent.guestName : selectedEvent.title)}
                </h3>
                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {isEditMode && editingEvent ? (
                // Edit Form
                <form onSubmit={(e) => { e.preventDefault(); handleEditEvent(); }} className="space-y-4" noValidate>
                  {/* Event Type */}
                  <div>
                    <label htmlFor="editEventType" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Event Type:</label>
                    <select
                      id="editEventType"
                      value={editingEvent.type}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, type: e.target.value as 'reservation' | 'hold' | 'maintenance' } : null)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="reservation">Reservation</option>
                      <option value="hold">Hold</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  {/* Reservation Type (only for reservation) */}
                  {editingEvent.type === 'reservation' && (
                    <div>
                      <label htmlFor="editReservationType" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Reservation Type:</label>
                      <select
                        id="editReservationType"
                        value={editingEvent.reservationType || 'guest'}
                        onChange={e => setEditingEvent(prev => prev ? { ...prev, reservationType: e.target.value as 'guest' | 'homeowner' | 'friends_family' } : null)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="homeowner">Homeowner</option>
                        <option value="friends_family">Friends & Family</option>
                        <option value="guest">Guest</option>
                      </select>
                  </div>
                )}

                  {/* Friends & Family specific options */}
                  {editingEvent.type === 'reservation' && editingEvent.reservationType === 'friends_family' && (
                    <>
                      <div>
                        <label htmlFor="editCleaningCostCoverage" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Cleaning Cost Coverage:</label>
                        <select
                          id="editCleaningCostCoverage"
                          value={editingEvent.cleaningCostCoverage || 'homeowner'}
                          onChange={e => setEditingEvent(prev => prev ? { ...prev, cleaningCostCoverage: e.target.value as 'homeowner' | 'guest' } : null)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="homeowner">Homeowner covers cleaning cost</option>
                          <option value="guest">Friends/Family pays cleaning cost</option>
                        </select>
              </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="editChargeNightlyRate"
                            checked={editingEvent.chargeNightlyRate || false}
                            onChange={(e) => setEditingEvent(prev => prev ? { ...prev, chargeNightlyRate: e.target.checked } : null)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="editChargeNightlyRate" className="ml-2 block text-sm text-gray-700">
                            Charge nightly rate to friends/family
                          </label>
          </div>

                        {editingEvent.chargeNightlyRate && (
                          <div>
                            <label htmlFor="editNightlyRateAmount" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Nightly Rate Amount:</label>
                            <input
                              type="number"
                              id="editNightlyRateAmount"
                              value={editingEvent.nightlyRateAmount || ''}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0 || e.target.value === '') {
                                  setEditingEvent(prev => prev ? { ...prev, nightlyRateAmount: e.target.value === '' ? undefined : value } : null);
                                }
                              }}
                              min="0"
                              step="0.01"
                              placeholder="e.g., 150"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Title for maintenance events only */}
                  {editingEvent.type === 'maintenance' && (
                <div>
                      <label htmlFor="editEventTitle" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Title:</label>
                      <input
                        type="text"
                        id="editEventTitle"
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                </div>
                  )}

                  <div>
                    <label htmlFor="editEventGuestName" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {editingEvent.type === 'hold' ? 'Reason:' : 
                       editingEvent.type === 'maintenance' ? 'Description:' : 
                       editingEvent.type === 'reservation' && editingEvent.reservationType === 'homeowner' ? 'Name:' : 'Guest Name:'}
                    </label>
                    <input
                      type="text"
                      id="editEventGuestName"
                      value={editingEvent.guestName}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, guestName: e.target.value } : null)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required={editingEvent.type === 'hold'}
                      placeholder={editingEvent.type === 'hold' ? 'Enter reason for hold' : 
                                  editingEvent.type === 'maintenance' ? 'e.g., HVAC repair, plumbing work' : 
                                  editingEvent.type === 'reservation' && editingEvent.reservationType === 'homeowner' ? 'Enter name' : 'Enter guest name'}
                    />
              </div>

                  {/* Email and Phone for reservation types */}
                  {editingEvent.type === 'reservation' && (
                    <>
                      <div>
                        <label htmlFor="editEventEmail" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Email:</label>
                        <input
                          type="email"
                          id="editEventEmail"
                          value={editingEvent.email || ''}
                          onChange={(e) => setEditingEvent(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter email address"
                          onInvalid={(e) => e.preventDefault()}
                          onBlur={(e) => {
                            // Clear any validation errors
                            e.target.setCustomValidity('');
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="editEventPhone" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number:</label>
                        <input
                          type="tel"
                          id="editEventPhone"
                          value={editingEvent.phoneNumber || ''}
                          onChange={(e) => setEditingEvent(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter phone number"
                          onInvalid={(e) => e.preventDefault()}
                          onBlur={(e) => {
                            // Clear any validation errors
                            e.target.setCustomValidity('');
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="editEventChannel" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Channel:</label>
                        <select
                          id="editEventChannel"
                          value={editingEvent.channel || 'direct'}
                          onChange={(e) => setEditingEvent(prev => prev ? { ...prev, channel: e.target.value } : null)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="direct">Direct</option>
                          <option value="airbnb">Airbnb</option>
                          <option value="booking.com">Booking.com</option>
                          <option value="vrbo">VRBO</option>
                          <option value="expedia">Expedia</option>
                          <option value="houfy">Houfy</option>
                          <option value="glamping.com">Glamping.com</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="editEventStartDate" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Start Date:</label>
                    <input
                      type="date"
                      id="editEventStartDate"
                      value={editingEvent.startDate}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      onInvalid={(e) => e.preventDefault()}
                    />
                  </div>

                  <div>
                    <label htmlFor="editEventEndDate" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">End Date:</label>
                    <input
                      type="date"
                      id="editEventEndDate"
                      value={editingEvent.endDate}
                      onChange={(e) => setEditingEvent(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      onInvalid={(e) => e.preventDefault()}
                    />
                  </div>

                  {/* Amount and Notes for reservation types */}
                  {editingEvent.type === 'reservation' && (
                    <>
                      <div>
                        <label htmlFor="editEventAmount" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Amount:</label>
                        <input
                          type="number"
                          id="editEventAmount"
                          value={editingEvent.amount || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value >= 0 || e.target.value === '') {
                              setEditingEvent(prev => prev ? { ...prev, amount: e.target.value === '' ? undefined : value } : null);
                            }
                          }}
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., 150.00"
                          onInvalid={(e) => e.preventDefault()}
                        />
                        </div>
                      <div>
                        <label htmlFor="editEventNotes" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Notes:</label>
                        <textarea
                          id="editEventNotes"
                          value={editingEvent.notes || ''}
                          onChange={(e) => setEditingEvent(prev => prev ? { ...prev, notes: e.target.value } : null)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Notes for other event types */}
                  {editingEvent.type !== 'reservation' && (
                    <div>
                      <label htmlFor="editEventNotes" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Notes:</label>
                      <textarea
                        id="editEventNotes"
                        value={editingEvent.notes || ''}
                        onChange={(e) => setEditingEvent(prev => prev ? { ...prev, notes: e.target.value } : null)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  )}

                  {/* Status field for all event types */}
                  <div>
                    <label htmlFor="editEventStatus" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Status:</label>
                    <select
                      id="editEventStatus"
                      value={editingEvent.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as 'confirmed' | 'pending' | 'cancelled';
                        
                        // Check cancellation permissions
                        if (newStatus === 'cancelled' && !canCancelReservation(editingEvent)) {
                          alert(getCancellationRestrictionMessage(editingEvent));
                          return;
                        }
                        
                        setEditingEvent(prev => prev ? { ...prev, status: newStatus } : null);
                      }}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {editingEvent.type === 'reservation' && !canCancelReservation(editingEvent) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getCancellationRestrictionMessage(editingEvent)}
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Property:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedEvent.propertyName}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {selectedEvent.type === 'hold' ? 'Reason:' : 
                       selectedEvent.type === 'maintenance' ? 'Description:' : 'Guest:'}
                              </span>
                    <p className="text-sm text-gray-900 mt-1">{selectedEvent.guestName}</p>
                            </div>

                  {/* Email and Phone for reservation types */}
                  {selectedEvent.type === 'reservation' && (
                    <>
                      {selectedEvent.email && (
                        <div>
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email:</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedEvent.email}</p>
                            </div>
                          )}
                      
                      {selectedEvent.phoneNumber && (
                        <div>
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone:</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedEvent.phoneNumber}</p>
                        </div>
                      )}
                      
                      {selectedEvent.channel && (
                        <div>
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Channel:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <ChannelIcon channel={selectedEvent.channel} className="text-gray-600" />
                            <p className="text-sm text-gray-900 capitalize">{selectedEvent.channel}</p>
                          </div>
                        </div>
                      )}
                      </>
                    )}
                  
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Dates:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {format(new Date(selectedEvent.startDate), 'MMM dd, yyyy')} - {format(new Date(selectedEvent.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Type:</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedEvent.type === 'reservation' ? 'bg-green-100 text-green-800' :
                      selectedEvent.type === 'hold' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedEvent.type === 'reservation' ? 'Reservation' :
                       selectedEvent.type === 'hold' ? 'Hold' : 'Maintenance'}
                    </span>
            </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status:</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedEvent.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      selectedEvent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                    </span>
        </div>
                  
                  {selectedEvent.amount && (
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Amount:</span>
                      <p className="text-sm text-gray-900 mt-1">${selectedEvent.amount}</p>
      </div>
                  )}
                  
                  {selectedEvent.notes && (
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Notes:</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedEvent.notes}</p>
          </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
                  {!isEditMode && (
                    <button
                      onClick={enterEditMode}
                      className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200"
                    >
                      Edit
                    </button>
                  )}
                  {isEditMode && (
                    <>
                      <button
                        onClick={handleEditEvent}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={exitEditMode}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={closeEventModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-200 scale-100 flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Event</h3>
                <button
                  onClick={closeAddEventModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }} className="space-y-4" noValidate>
                {/* Event Type */}
                <div>
                  <label htmlFor="eventType" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Event Type:</label>
                  <select
                    id="eventType"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as 'reservation' | 'hold' | 'maintenance' }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="reservation">Reservation</option>
                    <option value="hold">Hold</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Guest Name / Reason / Description */}
                <div>
                  <label htmlFor="eventGuestName" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {newEvent.type === 'hold' ? 'Reason:' : 
                     newEvent.type === 'maintenance' ? 'Description:' : 'Guest Name:'}
                  </label>
                  <input
                    type="text"
                    id="eventGuestName"
                    value={newEvent.guestName}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, guestName: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={newEvent.type === 'hold' ? 'Enter hold reason' : 
                               newEvent.type === 'maintenance' ? 'Enter maintenance description' : 'Enter guest name'}
                    required
                    onInvalid={(e) => e.preventDefault()}
                  />
                </div>

                {/* Guest Count for reservations */}
                {newEvent.type === 'reservation' && (
                  <div>
                    <label htmlFor="eventGuestCount" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Guest Count:</label>
                    <input
                      type="number"
                      id="eventGuestCount"
                      value={newEvent.guestCount}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 1 }))}
                      min="1"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      onInvalid={(e) => e.preventDefault()}
                    />
              </div>
                )}
              
                {/* Email and Phone for reservation types */}
                {newEvent.type === 'reservation' && (
                  <>
                <div>
                      <label htmlFor="eventEmail" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Email:</label>
                      <input
                        type="email"
                        id="eventEmail"
                        value={newEvent.email}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter email address"
                        onInvalid={(e) => e.preventDefault()}
                      />
                </div>
                <div>
                      <label htmlFor="eventPhone" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number:</label>
                      <input
                        type="tel"
                        id="eventPhone"
                        value={newEvent.phoneNumber}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter phone number"
                        onInvalid={(e) => e.preventDefault()}
                      />
                </div>
                <div>
                      <label htmlFor="eventChannel" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Channel:</label>
                      <select
                        id="eventChannel"
                        value={newEvent.channel}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, channel: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="direct">Direct</option>
                        <option value="airbnb">Airbnb</option>
                        <option value="booking.com">Booking.com</option>
                        <option value="vrbo">VRBO</option>
                        <option value="expedia">Expedia</option>
                        <option value="houfy">Houfy</option>
                        <option value="glamping.com">Glamping.com</option>
                      </select>
                </div>
                  </>
                )}

                <div>
                  <label htmlFor="eventStartDate" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Start Date:</label>
                  <input
                    type="date"
                    id="eventStartDate"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    onInvalid={(e) => e.preventDefault()}
                  />
              </div>

                <div>
                  <label htmlFor="eventEndDate" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">End Date:</label>
                  <input
                    type="date"
                    id="eventEndDate"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    onInvalid={(e) => e.preventDefault()}
                  />
            </div>

                {/* Amount and Notes for reservation types */}
                {newEvent.type === 'reservation' && (
                  <>
                    <div>
                      <label htmlFor="eventAmount" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Amount:</label>
                      <input
                        type="number"
                        id="eventAmount"
                        value={newEvent.amount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value >= 0 || e.target.value === '') {
                            setNewEvent(prev => ({ ...prev, amount: e.target.value === '' ? '' : e.target.value }));
                          }
                        }}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., 150.00"
                        onInvalid={(e) => e.preventDefault()}
                      />
      </div>
                    <div>
                      <label htmlFor="eventNotes" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Notes:</label>
                      <textarea
                        id="eventNotes"
                        value={newEvent.notes}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Notes for other event types */}
                {newEvent.type !== 'reservation' && (
                  <div>
                    <label htmlFor="eventNotes" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Notes:</label>
                    <textarea
                      id="eventNotes"
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
          </div>
                )}
              </form>
          </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeAddEventModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Add Event
                </button>
          </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default MultiCalendar;