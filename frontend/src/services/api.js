const BASE_URL = 'http://localhost:8000/api';

const api = {
    // Planners
    getPlanners: async () => {
        const response = await fetch(`${BASE_URL}/planners/`);
        if (!response.ok) throw new Error('Failed to fetch planners');
        return response.json();
    },
    createPlanner: async (plannerData) => {
        const response = await fetch(`${BASE_URL}/planners/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plannerData)
        });
        if (!response.ok) throw new Error('Failed to create planner');
        return response.json();
    },
    updatePlanner: async (id, plannerData) => {
        const response = await fetch(`${BASE_URL}/planners/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plannerData)
        });
        if (!response.ok) throw new Error('Failed to update planner');
        return response.json();
    },
    deletePlanner: async (id) => {
        const response = await fetch(`${BASE_URL}/planners/${id}/`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete planner');
        return true;
    },

    // Bookings
    getBookings: async (plannerId = null) => {
        let url = `${BASE_URL}/bookings/`;
        if (plannerId) url += `?planner_id=${plannerId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },
    getBooking: async (id) => {
        const response = await fetch(`${BASE_URL}/bookings/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch booking');
        return response.json();
    },
    createBooking: async (bookingData) => {
        const response = await fetch(`${BASE_URL}/bookings/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        if (!response.ok) throw new Error('Failed to create booking');
        return response.json();
    },
    deleteBooking: async (id) => {
        const response = await fetch(`${BASE_URL}/bookings/${id}/`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete booking');
        return true;
    },
    updateBookingStatus: async (id, status) => {
        const response = await fetch(`${BASE_URL}/bookings/${id}/status/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update booking status');
        return response.json();
    },
    updateBooking: async (id, data) => {
        const response = await fetch(`${BASE_URL}/bookings/${id}/`, {
            method: 'PATCH', // Use PATCH for partial updates
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update booking');
        return response.json();
    },

    // Auth
    plannerLogin: async (username, password) => {
        const response = await fetch(`${BASE_URL}/login/planner/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.status === 401) throw new Error('Invalid credentials');
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },
    adminLogin: async (email, password) => {
        const response = await fetch(`${BASE_URL}/login/admin/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.status === 401) throw new Error('Invalid credentials');
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },
    userLogin: async (email, password) => {
        const response = await fetch(`${BASE_URL}/login/user/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.status === 401) throw new Error('Invalid credentials');
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },
    userSignup: async (data) => {
        const response = await fetch(`${BASE_URL}/signup/user/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Signup failed');
        }
        return response.json();
    },
    createPaymentIntent: async (data) => {
        const response = await fetch(`${BASE_URL}/create-payment-intent/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create payment intent');
        return response.json();
    }
};

export default api;
