//
// IMPORTS
//
import { initialize } from 'pleg-connect/firebase';
//
// INTERFACE
//
export interface iConnection {
    initialize: (options: any) => Promise<void>;
}
//
// EXPORT
//
export const createConnection = (): iConnection => {
    const connection: iConnection = {
        async initialize(options) {
            initialize(options);
        },
    };
    return connection;
};
