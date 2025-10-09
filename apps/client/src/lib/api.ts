const API_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export const apiClient = {
  /**
   * Fetch all venues or filter by city
   */
  async getVenues(city?: string) {
    const url = city 
      ? `${API_URL}/public/venues?city=${encodeURIComponent(city)}`
      : `${API_URL}/public/venues`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }
    return response.json();
  },

  /**
   * Fetch single venue details
   */
  async getVenueById(id: number | string) {
    const response = await fetch(`${API_URL}/public/venues/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch venue details");
    }
    return response.json();
  },

  /**
   * Create a new booking
   */
  async createBooking(venueId: number, bookingData: any) {
    const response = await fetch(`${API_URL}/booking/${venueId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create booking");
    }
    
    return response.json();
  },

  /**
   * Get user's bookings (requires authentication)
   */
  async getMyBookings(token: string) {
    const response = await fetch(`${API_URL}/venues/bookings`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    
    return response.json();
  },

  /**
   * Delete a booking (requires authentication)
   */
  async deleteBooking(bookingId: number, token: string) {
    const response = await fetch(`${API_URL}/booking/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete booking");
    }
    
    return response.json();
  },
};
