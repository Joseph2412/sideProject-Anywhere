export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BookingFormData {
  venueId: number;
  packageId: number;
  start: string;
  end: string;
  people: number;
  userId: number;
  customerInfo: CustomerInfo;
}

export interface Booking {
  id: number;
  venueId: number;
  packageId: number;
  userId: number;
  start: string;
  end: string;
  people: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
