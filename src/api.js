const API_URL = 'http://localhost:5000/api';

export const getServices = async (query = '') => {
  try {
    const res = await fetch(`${API_URL}/services${query}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const getServiceById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/services/${id}`);
    if (!res.ok) throw new Error('Service not found');
    return await res.json();
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getLocations = async () => {
  try {
    const res = await fetch(`${API_URL}/locations`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

export const addService = async (service) => {
  try {
    const res = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    return await res.json();
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

export const getBookings = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/bookings?userId=${userId}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const createBooking = async (booking) => {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getMerchantProfile = async (email) => {
  try {
    const res = await fetch(`${API_URL}/merchant-profile/${email}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    return null;
  }
};

export const updateMerchantProfile = async (email, updates) => {
  try {
    const res = await fetch(`${API_URL}/merchant-profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, updates }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    throw error;
  }
};
