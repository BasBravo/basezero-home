import { createConnection } from '~~/shared/services';

let firebaseInitialized = false;
let initializationPromise: Promise<void> | null = null;

export const useFirebase = () => {
    const initializeFirebase = async () => {
        if (firebaseInitialized) {
            return Promise.resolve();
        }

        if (initializationPromise) {
            return initializationPromise;
        }

        initializationPromise = new Promise(async (resolve, reject) => {
            try {
                const config = useRuntimeConfig();
                const connectionService = createConnection();

                await connectionService.initialize(config.public.connectConfig);
                firebaseInitialized = true;
                resolve();
            } catch (error) {
                reject(error);
            }
        });

        return initializationPromise;
    };

    const isInitialized = () => firebaseInitialized;

    return {
        initializeFirebase,
        isInitialized,
    };
};
