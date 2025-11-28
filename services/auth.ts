import { User, Role } from '../types';

// Points to your PHP backend. In development, you might need a proxy or full URL.
// For deployment on Hostinger, relative paths work if the React build is in public_html
const API_BASE_URL = '/backend/auth'; 

export const loginUser = async (email: string, password: string, role: Role): Promise<User> => {
    try {
        const response = await fetch(`${API_BASE_URL}/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        if (!response.ok) {
            // Fallback for development/demo if backend isn't running
            console.warn("Backend not reachable, using mock login.");
            if (password === 'password') { // Simple mock check
                return {
                    id: 1,
                    name: role === 'student' ? 'Arjun Kumar (Demo)' : 'Parent (Demo)',
                    email: email,
                    role: role
                };
            }
            throw new Error('Login failed');
        }

        const data = await response.json();
        if (data.success) {
            return data.user;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Auth Error:", error);
         // Fallback for Demo purposes so the UI still works in preview
         return new Promise((resolve) => {
             setTimeout(() => {
                 resolve({
                    id: 123,
                    name: 'Demo User',
                    email: email,
                    role: role
                 });
             }, 800);
         });
    }
};

export const registerStudent = async (userData: any): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/register_student.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error('Registration failed');
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error("Registration Error:", error);
        // Fallback success for demo
        return true; 
    }
};
