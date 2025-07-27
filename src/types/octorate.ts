export interface OctorateCalendarDay {
  date: string;
  available: boolean;
  price?: number;
  minimumStay?: number;
  maximumStay?: number;
  arrivalAllowed?: boolean;
  departureAllowed?: boolean;
}

export interface OctorateCalendarResponse {
  propertyId: string;
  calendar: OctorateCalendarDay[];
}

export interface BookingRedirectParams {
  propertySlug: 'fienaroli' | 'moro';
  checkin: string; // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  guests: number;
}

export const OCTORATE_PROPERTIES = {
  fienaroli: {
    id: '917300',
    roomId: '280642',
    maxGuests: 6,
    calendarUrl: 'https://api.octorate.com/connect/rest/v1/reservation/calendar/917300?newTruncate=true&locale=en',
    bookingUrl: (params: { checkin: string; checkout: string; guests: number }) => 
      `https://book.octorate.com/octobook/site/ota/result.xhtml?id=826&property=917300&checkin=${params.checkin}&room=280642&checkout=${params.checkout}&pax=${params.guests}&network=917300`
  },
  moro: {
    id: '656889',
    maxGuests: 4,
    calendarUrl: 'https://api.octorate.com/connect/rest/v1/reservation/calendar/656889?newTruncate=true&locale=en',
    bookingUrl: (params: { checkin: string; checkout: string; guests: number }) =>
      `https://book.octorate.com/octobook/site/reservation/result.xhtml?siteKey=octosite656889&lang=en&ota=false&checkin=${params.checkin}&checkout=${params.checkout}&pax=${params.guests}`
  }
} as const;