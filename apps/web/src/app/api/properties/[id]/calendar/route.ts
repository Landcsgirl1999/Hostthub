import { NextRequest, NextResponse } from 'next/server';

interface CalendarDay {
  date: string;
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    
    const { id: propertyId } = await params;

    // Mock data - replace with database queries
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendarDays: CalendarDay[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Generate mock events
      const events: CalendarEvent[] = [];
      // Helper to check for overlap
      const isOverlap = (newEvent: CalendarEvent) => {
        return events.some(e => {
          const eStart = new Date(e.startDate);
          const eEnd = new Date(e.endDate);
          const nStart = new Date(newEvent.startDate);
          const nEnd = new Date(newEvent.endDate);
          return nStart <= eEnd && nEnd >= eStart;
        });
      };
      // Try to add reservation
      if (Math.random() > 0.7) {
        const reservation: CalendarEvent = {
          id: `reservation-${day}`,
          type: 'reservation',
          title: 'Guest Booking',
          startDate: dateString,
          endDate: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'confirmed',
          color: 'bg-blue-500'
        };
        if (!isOverlap(reservation)) events.push(reservation);
      }
      // Try to add cleaning
      if (Math.random() > 0.8) {
        const cleaning: CalendarEvent = {
          id: `cleaning-${day}`,
          type: 'cleaning',
          title: 'Cleaning',
          startDate: dateString,
          endDate: dateString,
          status: 'scheduled',
          color: 'bg-green-500'
        };
        if (!isOverlap(cleaning)) events.push(cleaning);
      }
      // Try to add maintenance
      if (Math.random() > 0.9) {
        const maintenance: CalendarEvent = {
          id: `maintenance-${day}`,
          type: 'maintenance',
          title: 'Maintenance',
          startDate: dateString,
          endDate: dateString,
          status: 'scheduled',
          color: 'bg-yellow-500'
        };
        if (!isOverlap(maintenance)) events.push(maintenance);
      }
      // Try to add block
      if (Math.random() > 0.95) {
        const block: CalendarEvent = {
          id: `block-${day}`,
          type: 'block',
          title: 'Block',
          startDate: dateString,
          endDate: dateString,
          status: 'blocked',
          color: 'bg-red-500'
        };
        if (!isOverlap(block)) events.push(block);
      }
      calendarDays.push({
        date: dateString,
        price: Math.round(450 * (0.8 + Math.random() * 0.4)), // Base price $450
        demandLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'average' : 'low',
        demandScore: Math.random(),
        isAvailable: Math.random() > 0.15,
        events
      });
    }
    
    // Calculate monthly stats
    const totalRevenue = calendarDays.reduce((sum, day) => sum + day.price, 0);
    const availableDays = calendarDays.filter(day => day.isAvailable).length;
    const occupancyRate = ((calendarDays.length - availableDays) / calendarDays.length) * 100;
    const averagePrice = totalRevenue / calendarDays.length;
    const totalBookings = calendarDays.reduce((sum, day) => sum + day.events.filter(e => e.type === 'reservation').length, 0);
    const totalNights = calendarDays.reduce((sum, day) => {
      const reservations = day.events.filter(e => e.type === 'reservation');
      return sum + reservations.length;
    }, 0);

    const monthlyStats: MonthlyStats = {
      totalRevenue,
      occupancyRate,
      averagePrice,
      totalBookings,
      totalNights
    };

    return NextResponse.json({
      propertyId,
      year,
      month,
      calendarDays,
      monthlyStats
    });
    
  } catch (error) {
    console.error('Error fetching property calendar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property calendar data' },
      { status: 500 }
    );
  }
} 