'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Users, Home, MapPin, Star } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  basePrice: number;
  rating: number;
  reviewCount: number;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  price: number;
  demandLevel: 'low' | 'average' | 'high';
  demandScore: number;
  isAvailable: boolean;
  events: CalendarEvent[];
}

interface CalendarEvent {
  id: string;
  type: 'reservation' | 'cleaning' | 'maintenance' | 'block' | 'task';
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  color: string;
}

interface MonthlyStats {
  totalRevenue: number;
  occupancyRate: number;
  averagePrice: number;
  totalBookings: number;
  totalNights: number;
}

interface PropertyCalendarProps {
  property: Property;
  showHeader?: boolean;
  showStats?: boolean;
  compact?: boolean;
  onDateClick?: (date: Date) => void;
}

export default function PropertyCalendar({
  property,
  showHeader = true,
  showStats = true,
  compact = false,
  onDateClick
}: PropertyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, property]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        price: Math.round(property?.basePrice * (0.8 + Math.random() * 0.4)),
        demandLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'average' : 'low',
        demandScore: Math.random(),
        isAvailable: Math.random() > 0.2,
        events: []
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      
      // Generate mock events
      const events: CalendarEvent[] = [];
      if (Math.random() > 0.7) {
        events.push({
          id: `event-${i}`,
          type: 'reservation',
          title: 'Guest Booking',
          startDate: date.toISOString().split('T')[0],
          endDate: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'confirmed',
          color: 'bg-blue-500'
        });
      }
      
      if (Math.random() > 0.8) {
        events.push({
          id: `cleaning-${i}`,
          type: 'cleaning',
          title: 'Cleaning',
          startDate: date.toISOString().split('T')[0],
          endDate: date.toISOString().split('T')[0],
          status: 'scheduled',
          color: 'bg-green-500'
        });
      }
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        price: Math.round(property?.basePrice * (0.8 + Math.random() * 0.4)),
        demandLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'average' : 'low',
        demandScore: Math.random(),
        isAvailable: Math.random() > 0.15,
        events
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        price: Math.round(property?.basePrice * (0.8 + Math.random() * 0.4)),
        demandLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'average' : 'low',
        demandScore: Math.random(),
        isAvailable: Math.random() > 0.2,
        events: []
      });
    }
    
    setCalendarDays(days);
    calculateMonthlyStats(days);
  };

  const calculateMonthlyStats = (days: CalendarDay[]) => {
    const currentMonthDays = days.filter(day => day.isCurrentMonth);
    const totalRevenue = currentMonthDays.reduce((sum, day) => sum + day.price, 0);
    const availableDays = currentMonthDays.filter(day => day.isAvailable).length;
    const occupancyRate = ((currentMonthDays.length - availableDays) / currentMonthDays.length) * 100;
    const averagePrice = totalRevenue / currentMonthDays.length;
    const totalBookings = currentMonthDays.reduce((sum, day) => sum + day.events.filter(e => e.type === 'reservation').length, 0);
    const totalNights = currentMonthDays.reduce((sum, day) => {
      const reservations = day.events.filter(e => e.type === 'reservation');
      return sum + reservations.length;
    }, 0);

    setMonthlyStats({
      totalRevenue,
      occupancyRate,
      averagePrice,
      totalBookings,
      totalNights
    });
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'reservation': return 'bg-blue-500';
      case 'cleaning': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'block': return 'bg-red-500';
      case 'task': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: CalendarDay) => {
    if (onDateClick) {
      onDateClick(day.date);
    }
  };

  return (
    <div className="space-y-4">
      {/* Property Header */}
      {showHeader && (
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{property.name}</h3>
            <div className="flex items-center space-x-4 mt-1 text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Up to {property.maxGuests} guests</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{property.rating} ({property.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Stats */}
      {showStats && monthlyStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Revenue</p>
                <p className="text-lg font-bold text-gray-900">${monthlyStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Occupancy</p>
                <p className="text-lg font-bold text-gray-900">{monthlyStats.occupancyRate.toFixed(1)}%</p>
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg Price</p>
                <p className="text-lg font-bold text-gray-900">${Math.round(monthlyStats.averagePrice)}</p>
              </div>
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Bookings</p>
                <p className="text-lg font-bold text-gray-900">{monthlyStats.totalBookings}</p>
              </div>
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Nights</p>
                <p className="text-lg font-bold text-gray-900">{monthlyStats.totalNights}</p>
              </div>
              <Calendar className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            <h4 className="text-lg font-semibold text-gray-900">{formatDate(currentDate)}</h4>
            
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={goToToday}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 w-full">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`${compact ? 'min-h-[80px]' : 'min-h-[140px]'} p-1 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-medium ${
                  day.isToday ? 'text-blue-600' : ''
                }`}>
                  {day.date.getDate()}
                </span>
                <span className={`text-xs px-1 py-0.5 rounded ${
                  day.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {day.isAvailable ? 'A' : 'B'}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-900">
                  ${day.price}
                </div>
                
                {!compact && (
                  <div className={`text-xs px-1 py-0.5 rounded ${getDemandColor(day.demandLevel)}`}>
                    {day.demandLevel.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Events */}
                <div className="space-y-1">
                  {day.events.slice(0, compact ? 1 : 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded text-white ${getEventColor(event.type)}`}
                    >
                      {compact ? event.type.charAt(0).toUpperCase() : event.title}
                    </div>
                  ))}
                  {!compact && day.events.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{day.events.length - 2}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 