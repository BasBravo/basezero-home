//
// IMPORTS
//
import { Items } from 'pleg-connect/firebase';
//
// INTERFACE
//
export interface iUser {
    collection: InstanceType<typeof Items>;
    getUsers: (options?: any) => Promise<any>;
    getUser: (uid: string, options?: any) => Promise<any>;
    save: (data: any) => Promise<any>;
    delete: (uid: string) => Promise<any | null>;
    generatePassword: (length?: number) => string;
    // Credit management methods
    getUserCredits: (uid?: string) => Promise<number>;
    addCredits: (uid: string, credits: number) => Promise<any>;
    deductCredits: (uid: string, credits: number) => Promise<any>;
    ensureUserWithCredits: (email: string, defaultCredits?: number) => Promise<any>;
    canAfford: (email: string, cost: number) => Promise<boolean>;
    getGuestUid: () => string;
    initializeUserCredits: (uid: string, defaultCredits?: number) => Promise<any>;
}
//
// FACTORY FUNCTION
//
export const createUser = (): iUser => {
    const user: iUser = {
        collection: new Items('users'),

        getUsers: async (options?: any): Promise<any> => {
            const result = await user.collection.get(options);
            return result;
        },

        getUser: async (uid: string, options?: any): Promise<any> => {
            if (!uid) return null;

            const result = await user.collection.find(uid, options);

            if (!result.success) return { success: false, message: result.message || 'Error getting user' };
            return { success: true, data: result.data };
        },

        save: async (data: any): Promise<any> => {
            const saveOptions = { uniques: ['email'] };

            return await user.collection.save(data, saveOptions);
        },

        delete: async (uid: string): Promise<any | null> => {
            const result = await user.collection.delete(uid);
            return result;
        },

        generatePassword: (length: number = 8): string => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let password = '';
            for (let i = 0; i < length; i++) {
                const at = Math.floor(Math.random() * charset.length);
                password += charset.charAt(at);
            }
            return password;
        },

        // Credit management methods
        getUserCredits: async (uid?: string): Promise<number> => {
            try {
                console.log('getUserCredits called with UID:', uid);
                
                // If UID provided, try to find user in database
                if (uid) {
                    console.log('Trying to find user in database with UID:', uid);
                    const result = await user.collection.find(uid);
                    if (result.success && result.data && typeof result.data.credits === 'number') {
                        console.log('User found in database with credits:', result.data.credits);
                        return result.data.credits;
                    }
                    console.log('User not found in database for UID:', uid);
                } else {
                    console.log('No UID provided, using guest UID');
                }

                // For non-registered users, use localStorage with browser-based UID
                if (typeof window !== 'undefined') {
                    const guestUid = user.getGuestUid();
                    const localStorageKey = `mapster_credits_${guestUid}`;
                    const storedCredits = localStorage.getItem(localStorageKey);
                    
                    if (storedCredits) {
                        const credits = parseInt(storedCredits, 10);
                        console.log('Found credits in localStorage:', credits, 'for guest UID:', guestUid);
                        return isNaN(credits) ? 3 : credits;
                    } else {
                        // First time user, assign default credits and store in localStorage
                        console.log('First time user, assigning 3 credits to localStorage for guest UID:', guestUid);
                        localStorage.setItem(localStorageKey, '3');
                        return 3;
                    }
                }

                // Default credits if all else fails
                return 3;
            } catch (error) {
                console.error('Error getting user credits:', error);
                
                // Fallback to localStorage if database fails
                if (typeof window !== 'undefined') {
                    const guestUid = user.getGuestUid();
                    const localStorageKey = `mapster_credits_${guestUid}`;
                    const storedCredits = localStorage.getItem(localStorageKey);
                    
                    if (storedCredits) {
                        const credits = parseInt(storedCredits, 10);
                        return isNaN(credits) ? 3 : credits;
                    } else {
                        localStorage.setItem(localStorageKey, '3');
                        return 3;
                    }
                }
                
                return 3;
            }
        },

        addCredits: async (email: string, credits: number, uid?: string): Promise<any> => {
            try {
                let existingUser = null;

                // If UID is provided, try to find user by UID first
                if (uid) {
                    const uidResult = await user.collection.find(uid);
                    if (uidResult.success && uidResult.data) {
                        existingUser = uidResult.data;
                    }
                }

                // If no user found by UID, try by email
                if (!existingUser) {
                    const filters = [{ field: 'email', operator: '==', value: email.toLowerCase() }];
                    const emailResult = await user.collection.get({ filters });

                    if (emailResult.success && emailResult.items.length > 0) {
                        existingUser = emailResult.items[0];
                    }
                }

                if (existingUser) {
                    const currentCredits = existingUser.credits || 0;
                    const newCredits = currentCredits + credits;

                    const saveResult = await user.collection.save({
                        uid: existingUser.uid,
                        credits: newCredits,
                    });

                    console.log('Credits added successfully:', {
                        uid: existingUser.uid,
                        email: existingUser.email,
                        previousCredits: currentCredits,
                        creditsAdded: credits,
                        newTotal: newCredits
                    });

                    return { success: true, credits: newCredits, added: credits };
                }

                return { success: false, message: 'User not found' };
            } catch (error) {
                console.error('Error adding credits:', error);
                return { success: false, message: error instanceof Error ? error.message : String(error) };
            }
        },

        deductCredits: async (uid: string, credits: number): Promise<any> => {
            try {
                // If UID provided, try to find and update user in database
                if (uid && !uid.startsWith('guest_')) {
                    const result = await user.collection.find(uid);
                    
                    if (result.success && result.data) {
                        const currentCredits = result.data.credits || 0;

                        if (currentCredits < credits) {
                            return { success: false, message: 'Insufficient credits' };
                        }

                        const newCredits = Math.max(0, currentCredits - credits);
                        const saveResult = await user.collection.save({
                            uid: uid,
                            credits: newCredits,
                        });

                        return saveResult;
                    }
                }

                // For guest users or if user not found in database, use localStorage
                if (typeof window !== 'undefined') {
                    const guestUid = uid || user.getGuestUid();
                    const localStorageKey = `mapster_credits_${guestUid}`;
                    const storedCredits = localStorage.getItem(localStorageKey);
                    
                    if (storedCredits) {
                        const currentCredits = parseInt(storedCredits, 10);
                        
                        if (isNaN(currentCredits) || currentCredits < credits) {
                            return { success: false, message: 'Insufficient credits' };
                        }
                        
                        const newCredits = Math.max(0, currentCredits - credits);
                        localStorage.setItem(localStorageKey, newCredits.toString());
                        
                        return { success: true, credits: newCredits };
                    }
                }

                return { success: false, message: 'User not found' };
            } catch (error) {
                console.error('Error deducting credits:', error);
                return { success: false, message: error instanceof Error ? error.message : String(error) };
            }
        },

        ensureUserWithCredits: async (email: string, defaultCredits: number = 3): Promise<any> => {
            try {
                const filters = [{ field: 'email', operator: '==', value: email.toLowerCase() }];
                const result = await user.collection.get({ filters });

                if (result.success && result.items.length > 0) {
                    // User exists, return existing user
                    return { success: true, data: result.items[0], isNewUser: false };
                } else {
                    // User doesn't exist, create new user with default credits
                    const newUser = {
                        email: email.toLowerCase(),
                        credits: defaultCredits,
                        createdAt: new Date().toISOString(),
                        isGuest: true, // Mark as guest user (not fully registered)
                    };

                    const saveResult = await user.collection.save(newUser);

                    if (saveResult.success) {
                        return {
                            success: true,
                            data: { ...newUser, uid: saveResult.uid },
                            isNewUser: true,
                        };
                    }

                    return saveResult;
                }
            } catch (error) {
                console.error('Error ensuring user with credits:', error);
                return { success: false, message: error.message };
            }
        },

        canAfford: async (email: string, cost: number): Promise<boolean> => {
            try {
                const credits = await user.getUserCredits();
                return credits >= cost;
            } catch (error) {
                console.error('Error checking affordability:', error);
                return false;
            }
        },

        getGuestUid: (): string => {
            // Generate a unique UID for guest users based on browser fingerprint
            if (typeof window !== 'undefined') {
                let guestUid = localStorage.getItem('mapster_guest_uid');
                
                if (!guestUid) {
                    // Create a unique ID based on browser characteristics
                    const browserInfo = [
                        navigator.userAgent,
                        navigator.language,
                        screen.width,
                        screen.height,
                        new Date().getTimezoneOffset(),
                    ].join('|');
                    
                    // Create a simple hash of the browser info
                    let hash = 0;
                    for (let i = 0; i < browserInfo.length; i++) {
                        const char = browserInfo.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash; // Convert to 32-bit integer
                    }
                    
                    // Add random component to ensure uniqueness
                    const randomPart = Math.random().toString(36).substring(2, 15);
                    guestUid = `guest_${Math.abs(hash).toString(36)}_${randomPart}`;
                    
                    localStorage.setItem('mapster_guest_uid', guestUid);
                }
                
                return guestUid;
            }
            
            return 'guest_default';
        },

        initializeUserCredits: async (uid: string, defaultCredits: number = 3): Promise<any> => {
            try {
                console.log('Initializing credits for user:', uid);
                
                // Get user data
                const result = await user.collection.find(uid);
                
                if (result.success && result.data) {
                    // Check if user already has credits field
                    if (typeof result.data.credits === 'number') {
                        console.log('User already has credits:', result.data.credits);
                        return { success: true, credits: result.data.credits, alreadyInitialized: true };
                    }
                    
                    // User exists but doesn't have credits field, add it
                    console.log('User exists but no credits field, adding default credits:', defaultCredits);
                    const updateResult = await user.collection.save({
                        uid: uid,
                        credits: defaultCredits,
                    });
                    
                    if (updateResult.success) {
                        return { success: true, credits: defaultCredits, alreadyInitialized: false };
                    }
                    
                    return updateResult;
                } else {
                    console.log('User not found, cannot initialize credits');
                    return { success: false, message: 'User not found' };
                }
            } catch (error) {
                console.error('Error initializing user credits:', error);
                return { success: false, message: error instanceof Error ? error.message : String(error) };
            }
        },
    };

    return user;
};
