// Global state for credits
const credits = ref(0);
const loading = ref(false);
let userService: any = null;

// Function to get or create user service
const getUserService = async () => {
    if (!userService) {
        const { createUser } = await import('~~/shared/services/user');
        userService = createUser();
    }
    return userService;
};

export const useCredits = () => {
    const updateCredits = async (uid?: string) => {
        try {
            loading.value = true;
            const service = await getUserService();
            const newCredits = await service.getUserCredits(uid);
            console.log('useCredits - updateCredits called with UID:', uid, 'got credits:', newCredits);
            credits.value = newCredits;
            console.log('useCredits - credits.value after update:', credits.value);
            return newCredits;
        } catch (error) {
            console.error('Error updating credits:', error);
            credits.value = 0;
            return 0;
        } finally {
            loading.value = false;
        }
    };

    const deductCredits = async (uid: string, amount: number) => {
        try {
            const service = await getUserService();
            const result = await service.deductCredits(uid, amount);
            if (result.success) {
                // Update local credits state
                credits.value = Math.max(0, credits.value - amount);
                return result;
            }
            return result;
        } catch (error) {
            console.error('Error deducting credits:', error);
            return { success: false, message: error.message };
        }
    };

    const getGuestUid = async () => {
        const service = await getUserService();
        return service.getGuestUid();
    };

    return {
        credits: readonly(credits),
        loading: readonly(loading),
        updateCredits,
        deductCredits,
        getGuestUid,
    };
};
