export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BookingFormData {
  venueId: string;      // ✅ MODIFICATO: da number a string
  packageId: string;    // ✅ MODIFICATO: da number a string
  start: string;        // Formato ISO 8601 (es. "2025-10-09T10:30:00.000Z")
  end: string;          // Formato ISO 8601
  people: number;
  userId: number;       // Questo rimarrà un numero come da logica backend
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
