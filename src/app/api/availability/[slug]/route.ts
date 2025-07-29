import { NextRequest, NextResponse } from 'next/server';
import { OCTORATE_PROPERTIES } from '@/types/octorate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const propertySlug = slug as 'fienaroli' | 'moro';
  
  if (!OCTORATE_PROPERTIES[propertySlug]) {
    return NextResponse.json(
      { error: 'Property not found' },
      { status: 404 }
    );
  }

  try {
    const property = OCTORATE_PROPERTIES[propertySlug];
    
    // Fetch from Octorate API server-side (no CORS issues)
    const response = await fetch(property.calendarUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/javascript, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; Property Management System)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Octorate API returned ${response.status}` },
        { status: response.status }
      );
    }

    const jsCode = await response.text();
    
    // Parse the JavaScript response
    const availability = parseOctorateResponse(jsCode);
    
    if (!availability) {
      return NextResponse.json(
        { error: 'Failed to parse Octorate response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      propertyId: property.id,
      calendar: availability,
      source: 'octorate-api',
      lastUpdated: new Date().toISOString()
    });

  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch availability data' },
      { status: 500 }
    );
  }
}

function parseOctorateResponse(jsCode: string) {
  try {
    // Extract only the octorateAvailCalendar for availability data
    let availability = {};
    let minStayData = {};
    
    // Parse availability object (only dates in this object are managed by Octorate)
    const availMatch = jsCode.match(/var octorateAvailCalendar = (\{[^}]*\});/);
    if (availMatch) {
      try {
        availability = JSON.parse(availMatch[1]);
      } catch {
        // Failed to parse availability
      }
    }
    
    // Parse minstay object for minimum stay requirements
    const minstayMatch = jsCode.match(/var minstay = (\{[^}]*\});/);
    if (minstayMatch) {
      try {
        minStayData = JSON.parse(minstayMatch[1]);
      } catch {
        // Failed to parse minstay
      }
    }
    
    // Generate calendar data for the next 365 days using Italian timezone (CEST)
    // Get current date in Italy (CEST/CET timezone)
    const now = new Date();
    const italianTimeString = now.toLocaleDateString("en-CA", {timeZone: "Europe/Rome"}); // YYYY-MM-DD format
    const today = new Date(italianTimeString + 'T00:00:00.000Z');
    const calendar = [];
    
    for (let i = -5; i < 365; i++) { // Start from 5 days ago to include past dates for gap management
      const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Check if date is in the past (not available)
      const isInPast = date < today;
      
      // SIMPLIFIED LOGIC: If date is NOT in octorateAvailCalendar, it's available (unless in past)
      // If date IS in octorateAvailCalendar, check its value (0 = unavailable, 1 = available)
      const availabilityData = availability as Record<string, number>;
      let isAvailable = false;
      
      if (isInPast) {
        isAvailable = false; // Past dates are never available
      } else {
        isAvailable = availabilityData.hasOwnProperty(dateStr) ? availabilityData[dateStr] === 1 : true;
      }
      
      calendar.push({
        date: dateStr,
        available: isAvailable,
        minimumStay: (minStayData as Record<string, number>)?.[dateStr] || 2,
        arrivalAllowed: true,
        departureAllowed: true,
      });
    }
    
    // Apply gap management: mark small gaps between unavailable dates as unavailable
    // This must happen AFTER we have all Octorate data processed
    const processedCalendar = applyGapManagement(calendar);
    
    // Filter out past dates from final result (only keep future dates for booking)
    const futureCalendar = processedCalendar.filter(day => new Date(day.date) >= today);
    
    return futureCalendar;
  } catch {
    // Failed to parse Octorate response
    return null;
  }
}

interface CalendarDay {
  date: string;
  available: boolean;
  minimumStay: number;
  arrivalAllowed: boolean;
  departureAllowed: boolean;
}

function applyGapManagement(calendar: CalendarDay[]) {
  // Find all unavailable dates
  const unavailableDates = calendar
    .filter(day => !day.available)
    .map(day => new Date(day.date))
    .sort((a, b) => a.getTime() - b.getTime());
  
  if (unavailableDates.length < 2) return calendar;
  
  const result = [...calendar];
  
  // Check gaps between consecutive unavailable dates
  for (let i = 0; i < unavailableDates.length - 1; i++) {
    const current = unavailableDates[i];
    const next = unavailableDates[i + 1];
    
    // Calculate days between the two unavailable dates
    const daysBetween = Math.floor((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)) - 1;
    
    // If gap is less than 3 days, mark intermediate dates as unavailable
    if (daysBetween > 0 && daysBetween < 3) {
      for (let j = 1; j <= daysBetween; j++) {
        const gapDate = new Date(current.getTime() + j * 24 * 60 * 60 * 1000);
        const gapDateStr = gapDate.toISOString().split('T')[0];
        
        const dayIndex = result.findIndex(day => day.date === gapDateStr);
        if (dayIndex !== -1) {
          result[dayIndex] = {
            ...result[dayIndex],
            available: false,
            arrivalAllowed: false,
            departureAllowed: false
          };
        }
      }
    }
  }
  
  return result;
}