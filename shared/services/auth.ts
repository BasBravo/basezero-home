//
// IMPORTS
//
import { Auth } from 'pleg-connect/firebase';
import { createApi } from './api';
import { createUser } from './user';
//
// INTERFACE
//
export interface iAuth {
    _firebaseAuth: InstanceType<typeof Auth> | null;
    _init: () => Promise<void>;
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string, name: string) => Promise<any>;
    logout: () => Promise<any>;
    resetPassword: (email: string) => Promise<any>;
    loginWithGoogle: () => Promise<any>;
    loginWithGitHub: () => Promise<any>;
    verifyToken: (token: string) => Promise<any>;
    getToken: () => Promise<string>;
    createUser: (email: string, name: string, uid?: string) => Promise<any>;
}
//
// FACTORY FUNCTION
//
export const createAuth = (): iAuth => {
    const apiService = createApi();
    
    const auth: iAuth = {
        _firebaseAuth: null,
        
        _init: async () => {
            if (!auth._firebaseAuth) {
                auth._firebaseAuth = new Auth();
            }
        },
        
        login: async (email: string, password: string) => {
            await auth._init();
            const parsePassword = password.trim();
            const result = await auth._firebaseAuth!.login(email, parsePassword);

            if (result.success) {
                const userResult = await auth.createUser(result.email, result.name || 'User', result.uid);
                
                // Inicializar créditos si el login fue exitoso
                if (result.uid) {
                    const userService = createUser();
                    await userService.initializeUserCredits(result.uid, 3);
                }
                
                return {
                    ...result,
                    userData: userResult
                };
            }

            return result;
        },
        
        register: async (email: string, password: string, name: string) => {
            await auth._init();
            const parsePassword = password.trim();
            const result = await auth._firebaseAuth!.createUser(email, parsePassword, name);
            
            if (result.success) {
                const userResult = await auth.createUser(email, name, result.uid);
                
                // Inicializar créditos si el registro fue exitoso
                if (result.uid) {
                    const userService = createUser();
                    await userService.initializeUserCredits(result.uid, 3);
                }
                
                return {
                    ...result,
                    userData: userResult
                };
            }
            
            return result;
        },
        
        logout: async () => {
            try {
                await auth._init();
                const result = await auth._firebaseAuth!.logout();
                return result;
            } catch (error) {
                return { success: false, message: 'logout-error' };
            }
        },
        
        resetPassword: async (email: string) => {
            try {
                await auth._init();
                const result = await auth._firebaseAuth!.resetPassword(email);
                return result;
            } catch (error) {
                return { success: false, message: 'reset-password-error' };
            }
        },
        
        loginWithGoogle: async () => {
            await auth._init();
            const languageCode = localStorage.getItem('locale') ?? 'en';
            const result = await auth._firebaseAuth!.loginWithService('google', { languageCode });

            if (result.success) {
                const parts = result.name?.split(' ') || ['User'];
                const name = parts.length > 1 ? parts[0] : result.name || 'User';
                const userResult = await auth.createUser(result.email, name, result.uid);
                
                // Inicializar créditos si el login fue exitoso
                if (result.uid) {
                    const userService = createUser();
                    await userService.initializeUserCredits(result.uid, 3);
                }
                
                return {
                    ...result,
                    userData: userResult
                };
            }
            return result ?? { success: false, message: 'login-failed' };
        },
        
        loginWithGitHub: async () => {
            await auth._init();
            const languageCode = localStorage.getItem('locale') ?? 'en';
            const result = await auth._firebaseAuth!.loginWithService('github', { languageCode });

            if (result.success) {
                const parts = result.name?.split(' ') || ['User'];
                const name = parts.length > 1 ? parts[0] : result.name || 'User';
                const userResult = await auth.createUser(result.email, name, result.uid);
                
                // Inicializar créditos si el login fue exitoso
                if (result.uid) {
                    const userService = createUser();
                    await userService.initializeUserCredits(result.uid, 3);
                }
                
                return {
                    ...result,
                    userData: userResult
                };
            }
            return result ?? { success: false, message: 'login-failed' };
        },
        
        verifyToken: async (token: string) => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const url = runtimeConfig.public.functionsUrl + '/auth/verify-token';

                const result = await apiService.request(url, {
                    method: 'POST',
                    body: { token },
                });

                return result;
            } catch (error) {
                return { success: false, message: 'token-verification-error' };
            }
        },
        
        createUser: async (email: string, name: string, uid?: string) => {
            await auth._init();
            const userService = createUser();
            const filter = [{ field: 'email', operator: '==', value: email }];
            const resultUsers = await userService.getUsers({ filters: filter });

            if (resultUsers.success && resultUsers.items.length > 0) {
                return { success: true, data: resultUsers.items[0] };
            }

            const data: any = {
                email,
                name,
                status: 'active',
                role: 'user',
                credits: 3, // Add default credits for new users
            };

            if (uid) data.uid = uid;

            const result = await userService.save(data);

            if (result.success) {
                return result;
            }

            return { success: false, message: 'user-not-created' };
        },
        
        getToken: async () => {
            const fireAuth = new Auth();
            const token = await fireAuth.refreshToken();
            return token ?? '';
        },
    };

    return auth;
};
