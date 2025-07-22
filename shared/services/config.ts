//
// IMPORTS
//
import { Items } from 'pleg-connect/firebase';
//
// INTERFACES
//
export interface iConfig {
    collection: InstanceType<typeof Items>;
    getConfig: (uid: string | null) => Promise<any>;
}
//
// EXPORT
//
export const createConfig = (): iConfig => {
    const config: iConfig = {
        collection: new Items('config'),

        getConfig: async (uid: string | null) => {
            if (!uid) uid = 'default';
            return await config.collection.find(uid);
        },
    };

    return config;
};
