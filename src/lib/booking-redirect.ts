import { format } from 'date-fns';

export interface AirbnbBookingParams {
  checkin: string;
  checkout: string;
  guests: number;
}

export const AIRBNB_PROPERTIES = {
  fienaroli: {
    roomId: '20247826',
    maxGuests: 6,
    bookingUrl: (params: AirbnbBookingParams) => 
      `https://www.airbnb.com/rooms/20247826?check_in=${params.checkin}&guests=${params.guests}&adults=${params.guests}&check_out=${params.checkout}`
  },
  moro: {
    roomId: '998346242016693375',
    maxGuests: 4,
    bookingUrl: (params: AirbnbBookingParams) =>
      `https://www.airbnb.com/rooms/998346242016693375?check_in=${params.checkin}&guests=${params.guests}&adults=${params.guests}&check_out=${params.checkout}`
  }
} as const;

export function getBookingUrl(
  propertySlug: 'fienaroli' | 'moro',
  checkin: Date,
  checkout: Date,
  guests: number
): string {
  const property = AIRBNB_PROPERTIES[propertySlug];
  
  // Validate guests
  if (guests < 1 || guests > property.maxGuests) {
    throw new Error(`Guests must be between 1 and ${property.maxGuests}`);
  }
  
  return property.bookingUrl({
    checkin: format(checkin, 'yyyy-MM-dd'),
    checkout: format(checkout, 'yyyy-MM-dd'),
    guests
  });
}