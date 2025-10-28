export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BookingFormData {
  venueId: number;    // ✅ Change from string to number
  packageId: number;  // ✅ Change from string to number
  start: string;
  end: string;
  people: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
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
