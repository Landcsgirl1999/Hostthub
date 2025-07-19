'use client';

import { useState, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'reservation' | 'task' | 'maintenance' | 'cleaning' | 'block' | 'hold';
  property?: string;
  guest?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'blocked' | 'on-hold';
  source?: 'airbnb' | 'vrbo' | 'expedia' | 'booking' | 'direct' | 'manual';
  blockType?: 'maintenance' | 'cleaning' | 'owner' | 'unavailable' | 'seasonal' | 'emergency';
  startDate?: string;
  endDate?: string;
  notes?: string;
}

interface UserProperty {
  id: string;
  name: string;
  type: 'house' | 'apartment' | 'cabin' | 'villa' | 'condo';
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  assignedTo: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedProperties: string[];
}

export default function UserCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<string>('maintenance');
  const [blockNotes, setBlockNotes] = useState('');
  const [holdDuration, setHoldDuration] = useState(24);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [user, setUser] = useState<User | null>(null);
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);

  // Simulate current user data (in real app, this would come from auth context)
  useEffect(() => {
    const currentUser: User = {
      id: 'user-1',
      name: 'Sierra Reynolds',
      email: 'Sierra.reynolds@Hostit.com',
      role: 'PROPERTY_MANAGER',
      assignedProperties: ['prop-1', 'prop-2', 'prop-3']
    };
    setUser(currentUser);

    const properties: UserProperty[] = [
      {
        id: 'prop-1',
        name: 'Beach House #1',
        type: 'house',
        location: 'Malibu, CA',
        status: 'active',
        assignedTo: 'user-1'
      },
      {
        id: 'prop-2',
        name: 'Mountain Cabin',
        type: 'cabin',
        location: 'Aspen, CO',
        status: 'active',
        assignedTo: 'user-1'
      },
      {
        id: 'prop-3',
        name: 'City Apartment',
        type: 'apartment',
        location: 'New York, NY',
        status: 'active',
        assignedTo: 'user-1'
      }
    ];
    setUserProperties(properties);
  }, []);

  // Sample events data filtered for user's properties
  useEffect(() => {
    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Beach House Check-in',
        date: '2024-07-15',
        type: 'reservation',
        property: 'Beach House #1',
        guest: 'John Smith',
        status: 'confirmed',
        source: 'airbnb'
      },
      {
        id: '2',
        title: 'Mountain Cabin Cleaning',
        date: '2024-07-16',
        type: 'cleaning',
        property: 'Mountain Cabin',
        status: 'pending',
        source: 'vrbo'
      },
      {
        id: '3',
        title: 'Pool Maintenance Block',
        date: '2024-07-18',
        type: 'block',
        property: 'Beach House #1',
        status: 'blocked',
        blockType: 'maintenance',
        startDate: '2024-07-18',
        endDate: '2024-07-20',
        notes: 'Annual pool maintenance and cleaning'
      },
      {
        id: '4',
        title: 'City Apartment Check-out',
        date: '2024-07-20',
        type: 'reservation',
        property: 'City Apartment',
        guest: 'Sarah Johnson',
        status: 'confirmed',
        source: 'expedia'
      },
      {
        id: '5',
        title: 'Owner Stay Block',
        date: '2024-07-22',
        type: 'block',
        property: 'Mountain Cabin',
        status: 'blocked',
        blockType: 'owner',
        startDate: '2024-07-22',
        endDate: '2024-07-25',
        notes: 'Family vacation'
      },
      {
        id: '6',
        title: 'Pending Reservation Hold',
        date: '2024-07-25',
        type: 'hold',
        property: 'Beach House #1',
        status: 'on-hold',
        startDate: '2024-07-25',
        endDate: '2024-07-26',
        notes: 'Waiting for guest confirmation'
      }
    ];
    setEvents(sampleEvents);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      // Filter by selected property
      if (selectedProperty !== 'all' && event.property !== userProperties.find(p => p.id === selectedProperty)?.name) {
        return false;
      }
      
      if (event.date === dateString) return true;
      
      if (event.startDate && event.endDate) {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        const checkDate = new Date(dateString);
        return checkDate >= start && checkDate <= end;
      }
      
      return false;
    });
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'reservation': return 'bg-blue-500';
      case 'cleaning': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'task': return 'bg-purple-500';
      case 'block': return 'bg-red-500';
      case 'hold': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getBlockTypeColor = (blockType?: string) => {
    switch (blockType) {
      case 'maintenance': return 'bg-red-600';
      case 'cleaning': return 'bg-red-500';
      case 'owner': return 'bg-red-700';
      case 'unavailable': return 'bg-gray-600';
      case 'seasonal': return 'bg-red-800';
      case 'emergency': return 'bg-red-900';
      default: return 'bg-red-500';
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'airbnb': return '🏠';
      case 'vrbo': return '🏖️';
      case 'expedia': return '✈️';
      case 'booking': return '🌍';
      case 'direct': return '📞';
      case 'manual': return '✏️';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'on-hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const addBlock = () => {
    if (!selectedDate) return;
    
    const propertyName = selectedProperty === 'all' 
      ? 'All Properties' 
      : userProperties.find(p => p.id === selectedProperty)?.name || 'All Properties';
    
    const newBlock: CalendarEvent = {
      id: Date.now().toString(),
      title: `${selectedBlockType.charAt(0).toUpperCase() + selectedBlockType.slice(1)} Block`,
      date: selectedDate.toISOString().split('T')[0],
      type: 'block',
      property: propertyName,
      status: 'blocked',
      blockType: selectedBlockType as any,
      startDate: selectedDate.toISOString().split('T')[0],
      endDate: selectedDate.toISOString().split('T')[0],
      notes: blockNotes
    };
    
    setEvents(prev => [...prev, newBlock]);
    setShowBlockModal(false);
    setBlockNotes('');
  };

  const addHold = () => {
    if (!selectedDate) return;
    
    const propertyName = selectedProperty === 'all' 
      ? 'All Properties' 
      : userProperties.find(p => p.id === selectedProperty)?.name || 'All Properties';
    
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setHours(endDate.getHours() + holdDuration);
    
    const newHold: CalendarEvent = {
      id: Date.now().toString(),
      title: 'Reservation Hold',
      date: selectedDate.toISOString().split('T')[0],
      type: 'hold',
      property: propertyName,
      status: 'on-hold',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      notes: `Hold for ${holdDuration} hours`
    };
    
    setEvents(prev => [...prev, newHold]);
    setShowHoldModal(false);
    setHoldDuration(24);
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!user) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Calendar</h2>
          <p className="text-gray-600 mt-1">Manage your assigned properties: {userProperties.length} properties</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Property Filter */}
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
          >
            <option value="all">All Properties</option>
            {userProperties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
          
          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBlockModal(true)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              🚫 Add Block
            </button>
            <button
              onClick={() => setShowHoldModal(true)}
              className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              ⏸️ Add Hold
            </button>
          </div>
          
          {/* View Toggle */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-1">
            {(['month', 'week', 'day'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === viewType
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userProperties.map((property) => (
          <div
            key={property.id}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedProperty === property.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white/60 backdrop-blur-sm hover:border-gray-300'
            }`}
            onClick={() => setSelectedProperty(property.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.location}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  property.status === 'active' ? 'bg-green-100 text-green-800' :
                  property.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status}
                </span>
              </div>
              <div className="text-2xl">
                {property.type === 'house' ? '🏠' :
                 property.type === 'apartment' ? '🏢' :
                 property.type === 'cabin' ? '🏡' :
                 property.type === 'villa' ? '🏰' : '🏘️'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Block</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Properties</option>
                  {userProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Block Type
                </label>
                <select
                  value={selectedBlockType}
                  onChange={(e) => setSelectedBlockType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="owner">Owner Stay</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="seasonal">Seasonal Closure</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date: {selectedDate?.toLocaleDateString()}
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Reason for blocking..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addBlock}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Add Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Hold Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Hold</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Properties</option>
                  {userProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hold Duration (hours)
                </label>
                <select
                  value={holdDuration}
                  onChange={(e) => setHoldDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date: {selectedDate?.toLocaleDateString()}
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Reason for hold..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowHoldModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addHold}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-xl font-semibold text-gray-900">
            {formatDate(currentDate)}
          </h3>
          
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const dayEvents = day ? getEventsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && day && day.toDateString() === selectedDate.toDateString();
            
            const hasBlock = dayEvents.some(event => event.type === 'block');
            const hasHold = dayEvents.some(event => event.type === 'hold');
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-100 rounded-lg transition-colors cursor-pointer ${
                  isToday ? 'bg-blue-50 border-blue-200' : ''
                } ${isSelected ? 'bg-purple-50 border-purple-200' : ''} ${
                  hasBlock ? 'bg-red-50 border-red-200' : ''
                } ${hasHold ? 'bg-orange-50 border-orange-200' : ''}`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    {/* Events */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate cursor-pointer transition-colors ${
                            event.type === 'block' 
                              ? getBlockTypeColor(event.blockType)
                              : getEventColor(event.type)
                          } text-white flex items-center justify-between`}
                          title={`${event.title} - ${event.property || ''} (${event.source || 'manual'})`}
                        >
                          <span className="truncate">{event.title}</span>
                          <span className="ml-1">
                            {event.type === 'block' ? '🚫' : event.type === 'hold' ? '⏸️' : getSourceIcon(event.source)}
                          </span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <div className="space-y-3">
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No events scheduled for this date</p>
            ) : (
              getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'block' 
                        ? getBlockTypeColor(event.blockType)
                        : getEventColor(event.type)
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      {event.property && (
                        <p className="text-sm text-gray-600">{event.property}</p>
                      )}
                      {event.guest && (
                        <p className="text-sm text-gray-600">Guest: {event.guest}</p>
                      )}
                      {event.notes && (
                        <p className="text-sm text-gray-600 italic">{event.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {event.type}
                    </span>
                    <span className="text-lg" title={`Source: ${event.source || 'manual'}`}>
                      {event.type === 'block' ? '🚫' : event.type === 'hold' ? '⏸️' : getSourceIcon(event.source)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Reservations</p>
              <p className="text-lg font-semibold text-gray-900">
                {events.filter(e => e.type === 'reservation').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Cleanings</p>
              <p className="text-lg font-semibold text-gray-900">
                {events.filter(e => e.type === 'cleaning').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Blocks</p>
              <p className="text-lg font-semibold text-gray-900">
                {events.filter(e => e.type === 'block').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Holds</p>
              <p className="text-lg font-semibold text-gray-900">
                {events.filter(e => e.type === 'hold').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 