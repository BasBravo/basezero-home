import { defineStore } from 'pinia';

interface User {
    uid: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthData {
    token: string;
    uid: string;
    email: string;
}

interface AuthState {
    user: User | null;
    auth: AuthData | null;
    isAuthenticated: boolean;
    loading: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        auth: null,
        isAuthenticated: false,
        loading: false,
    }),

    actions: {
        saveUser(userData: { auth: AuthData; data: User }) {
            this.auth = userData.auth;
            this.user = userData.data;
            this.isAuthenticated = true;
            
            // Store token in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', userData.auth.token);
            }
        },

        setUser(user: User) {
            this.user = user;
            this.isAuthenticated = true;
        },

        clear() {
            this.user = null;
            this.auth = null;
            this.isAuthenticated = false;
            
            // Remove token from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
            }
        },

        setLoading(loading: boolean) {
            this.loading = loading;
        },

        getTokenEncrypted(): string | null {
            return this.auth?.token || null;
        },

        async checkAuth() {
            this.loading = true;
            
            try {
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('auth_token');
                    if (token && this.auth?.token === token) {
                        // Token exists and matches stored auth
                        this.isAuthenticated = true;
                        return;
                    }
                    
                    if (token) {
                        // TODO: Validate token with backend
                        // For now, assume valid if token exists
                        this.auth = {
                            token,
                            uid: 'mock-uid',
                            email: 'user@example.com',
                        };
                        this.user = {
                            uid: 'mock-uid',
                            email: 'user@example.com',
                            name: 'User',
                        };
                        this.isAuthenticated = true;
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.clear();
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            this.loading = true;
            
            try {
                // TODO: Implement actual logout logic with backend
                this.clear();
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                this.loading = false;
            }
        },
    },

    persist: {
        key: 'mapster-auth-store',
        paths: ['user', 'auth', 'isAuthenticated'],
    },
});