'use client';

import { useState, useEffect } from 'react';

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  reason?: string;
}

interface ConsultationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  propertyCount: string;
  selectedDate: string;
  selectedTime: string;
  preferredMethod: 'video' | 'phone';
  message: string;
}

export default function ConsultationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const [form, setForm] = useState<ConsultationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    propertyCount: '1',
    selectedDate: '',
    selectedTime: '',
    preferredMethod: 'video',
    message: ''
  });

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (form.selectedDate) {
      console.log('📅 Date selected:', form.selectedDate);
      fetchAvailableSlots();
    }
  }, [form.selectedDate]);

  const fetchAvailableSlots = async () => {
    console.log('🚀 fetchAvailableSlots called');
    setIsLoadingSlots(true);
    setShowTimeSlots(false);
    setError('');
    
    try {
      // Call the real Google Calendar API
      const response = await fetch('/api/calendar/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: form.selectedDate,
          endDate: form.selectedDate
        }),
      });

      console.log('📡 API Response status:', response.status);
      
      const data = await response.json();
      console.log('📡 API Response data:', data);
      
      if (data.success) {
        // Filter slots for the selected date only
        let dateSlots = data.availableSlots.filter((slot: TimeSlot) => 
          slot.date === form.selectedDate
        );
        
        // If it's today, filter out past times
        const today = new Date().toISOString().split('T')[0];
        if (form.selectedDate === today) {
          const currentTime = new Date();
          const currentHour = currentTime.getHours();
          const currentMinute = currentTime.getMinutes();
          const currentTimeMinutes = currentHour * 60 + currentMinute;
          
          dateSlots = dateSlots.map(slot => {
            const [hours, minutes] = slot.time.split(':').map(Number);
            const slotTimeMinutes = hours * 60 + minutes;
            
            if (slotTimeMinutes <= currentTimeMinutes) {
              return {
                ...slot,
                available: false,
                reason: 'Past time'
              };
            }
            return slot;
          });
        }
        
        console.log('✅ Available slots for', form.selectedDate, ':', dateSlots);
        setAvailableSlots(dateSlots);
        setShowTimeSlots(true);
      } else {
        console.error('❌ Failed to fetch slots:', data.error);
        setError('Failed to load available time slots');
      }
    } catch (error) {
      console.error('❌ Failed to fetch available slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Remove the generateMockTimeSlots function since we're using real data now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/consultation/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          company: form.company,
          propertyCount: form.propertyCount,
          selectedDate: form.selectedDate,
          selectedTime: form.selectedTime,
          preferredMethod: form.preferredMethod,
          message: form.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Consultation scheduled successfully! We will contact you shortly to confirm.');
        
        // Reset form
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          propertyCount: '1',
          selectedDate: '',
          selectedTime: '',
          preferredMethod: 'video',
          message: ''
        });
        setShowTimeSlots(false);
        setAvailableSlots([]);
      } else {
        setError(data.error || 'Failed to schedule consultation');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ConsultationForm, value: string) => {
    console.log('🔄 Input change:', field, value);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Generate time slots for display (9 AM to 5 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const existingSlot = availableSlots.find(slot => slot.time === time);
        
        // Convert to 12-hour format for display
        const displayTime = convertTo12Hour(time);
        
        slots.push({
          time,
          displayTime,
          available: existingSlot ? existingSlot.available : false,
          reason: existingSlot?.reason
        });
      }
    }
    return slots;
  };

  // Convert 24-hour time to 12-hour format
  const convertTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const timeSlots = generateTimeSlots();
  const availableSlotsForDate = availableSlots.filter(slot => slot.available);

  console.log(' Render state:', {
    selectedDate: form.selectedDate,
    showTimeSlots,
    availableSlots: availableSlots.length,
    availableSlotsForDate: availableSlotsForDate.length,
    timeSlots: timeSlots.length,
    isLoadingSlots
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Schedule Your Free Consultation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized guidance on how HostIt can transform your property management. 
            No account required - just 30 minutes of your time.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{success}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consultation Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Properties *
                  </label>
                  <select
                    value={form.propertyCount}
                    onChange={(e) => handleInputChange('propertyCount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="1">1 Property</option>
                    <option value="2">2 Properties</option>
                    <option value="3">3 Properties</option>
                    <option value="4">4 Properties</option>
                    <option value="5">5 Properties</option>
                    <option value="10">6-10 Properties</option>
                    <option value="15">11-15 Properties</option>
                    <option value="25">16-25 Properties</option>
                    <option value="50">26-50 Properties</option>
                    <option value="100">50+ Properties</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={form.selectedDate}
                    onChange={(e) => handleInputChange('selectedDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cannot select dates in the past
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Method *
                  </label>
                  <select
                    value={form.preferredMethod}
                    onChange={(e) => handleInputChange('preferredMethod', e.target.value as 'video' | 'phone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="video">Video Call (Google Meet)</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
              </div>

              {/* Available Time Slots */}
              {form.selectedDate && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Time Slots *
                    </label>
                    {isLoadingSlots && (
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Loading availability...
                      </div>
                    )}
                  </div>
                  
                  {showTimeSlots && (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => slot.available && handleInputChange('selectedTime', slot.time)}
                          disabled={!slot.available}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            form.selectedTime === slot.time
                              ? 'bg-blue-600 text-white border-blue-600'
                              : slot.available
                              ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                          title={slot.reason || (slot.available ? 'Available' : 'Unavailable')}
                        >
                          {slot.displayTime}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showTimeSlots && availableSlotsForDate.length === 0 && (
                    <div className="text-center py-6">
                      <div className="text-gray-500 mb-2">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">
                        {form.selectedDate === new Date().toISOString().split('T')[0] 
                          ? 'No available slots for today. Please select a future date.'
                          : 'No available slots for this date. Please select a different date.'
                        }
                      </p>
                    </div>
                  )}
                  
                  {showTimeSlots && availableSlotsForDate.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {availableSlotsForDate.length} slot{availableSlotsForDate.length !== 1 ? 's' : ''} available • 
                      Greyed out times are already booked or unavailable
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  placeholder="Tell us about your current property management challenges, specific questions, or anything else you'd like to discuss..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !form.selectedTime}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Scheduling Consultation...
                  </div>
                ) : (
                  'Schedule Free Consultation'
                )}
              </button>
              <p className="text-sm text-gray-500 text-center mt-3">
                No account required • 30-minute consultation • Free of charge
              </p>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">30 Minutes</h3>
            <p className="text-gray-600">Quick, focused consultation to understand your needs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Commitment</h3>
            <p className="text-gray-600">Free consultation with no obligation to purchase</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Guidance</h3>
            <p className="text-gray-600">Get personalized advice from property management experts</p>
          </div>
        </div>
      </div>
    </div>
  );
} 