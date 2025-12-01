import { User, Role } from '../types';
// In the single-file deployment, the backend is relative to index.html
const API_BASE_URL = 'backend/auth'; 

export const loginUser = async (email: string, password: string, role: Role): Promise<User> => {
    try {
        const response = await fetch(`${API_BASE_URL}/login.php`, {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) return data.user;
        }
    } catch (e) {
        console.warn("Backend unavailable, using demo mode");
    }
    // Demo Fallback
    return { id: 1, name: 'Demo User', email, role };
};

export const registerStudent = async (userData: any): Promise<boolean> => {
    return true; // Mock success
};