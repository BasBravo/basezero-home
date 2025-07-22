//
// IMPORTS
//
import { Items } from 'pleg-connect/firebase';
import { cleanUid } from '~~/helpers';
//
// INTERFACE
//
export interface iFile {
    collection: InstanceType<typeof Items>;
    getFile: (reference: string) => Promise<any>;
    getFiles: (references: string[]) => Promise<any>;
    save: (data: any) => Promise<any>;
    delete: (uid: string) => Promise<any>;
}
//
// FACTORY FUNCTION
//
export const createFile = (): iFile => {
    const file: iFile = {
        collection: new Items('files'),

        getFile: async (reference: string): Promise<any> => {
            const result = await file.collection.find(reference);
            if (!result.success) return { success: false, message: result.message || 'Error getting file' };
            return result.data;
        },

        getFiles: async (references: string[]): Promise<any> => {
            if (!references || !Array.isArray(references) || references.length === 0) return null;
            const finalFiles = [];
            for (const reference of references) {
                if (typeof reference !== 'string') continue;
                const result = await file.collection.find(reference);
                if (result.success) finalFiles.push(result.data);
            }
            return finalFiles;
        },

        save: async (data: any): Promise<any> => {
            const options = { returnOld: true };
            const result = await file.collection.save(data, options);
            return result;
        },

        delete: async (uid: string): Promise<any> => {
            const uidFile = cleanUid(uid);
            const result = await file.collection.delete(uidFile);
            return result;
        },
    };

    return file;
};
