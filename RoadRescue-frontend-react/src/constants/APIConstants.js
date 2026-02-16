export const API_PORT = 5030;
export const API_BASE_URL = `http://localhost:${API_PORT}/api`;

export const API_ENDPOINTS = {

    AUTH: {

        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
        RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,

    },

    USERS: {

        ALL: `${API_BASE_URL}/users`,
        BY_ID: (id) => `${API_BASE_URL}/users/${id}`

    },

    SERVICES: {

        ALL: `${API_BASE_URL}/services`,
        BY_ID: (id) => `${API_BASE_URL}/services/${id}`

    },

    BOOKINGS: {

        CREATE: `${API_BASE_URL}/booking/create`,
        MY_BOOKINGS: `${API_BASE_URL}/booking/my-bookings`,
        AVAILABLE: `${API_BASE_URL}/booking/available`,
        USER_BOOKINGS: `${API_BASE_URL}/booking/user`,
        ALL: `${API_BASE_URL}/booking/all`,
        ACCEPT: (id) => `${API_BASE_URL}/booking/${id}/accept`,
        COMPLETE: (id) => `${API_BASE_URL}/booking/${id}/complete`,
        HISTORY: `${API_BASE_URL}/booking/history`,
        RATE: (id) => `${API_BASE_URL}/booking/${id}/rate`

    },

    CONTACT: {

        ALL: `${API_BASE_URL}/contact`,
        BY_ID: (id) => `${API_BASE_URL}/contact/${id}`

    },

    EMERGENCY: {
        SOS: `${API_BASE_URL}/emergency/sos`,
        ACTIVE: `${API_BASE_URL}/emergency/active`,
        MY_ALERTS: `${API_BASE_URL}/emergency/my-alerts`,
        ASSIGN: (alertId, providerId) => `${API_BASE_URL}/emergency/${alertId}/assign/${providerId}`,
        RESOLVE: (alertId) => `${API_BASE_URL}/emergency/${alertId}/resolve`
    },

    PAYMENT: {

        CREATE_ORDER: `${API_BASE_URL}/payment/create-order`,
        VERIFY: `${API_BASE_URL}/payment/verify-payment`
        
    }

};
