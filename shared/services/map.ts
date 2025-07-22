//
// IMPORTS
//
import { Items } from 'pleg-connect/firebase';
import { createConfig } from './config.js';
import { createFile } from './file.js';
import { cleanUid } from '~~/helpers';

export interface iMap {
    _ppi: number;
    _pxToCm: (px: number) => number;
    _pxToIn: (px: number) => number;
    _cmToPx: (cm: number) => number;
    collection: InstanceType<typeof Items>;
    getMap: (uid: string) => Promise<any>;
    getMaps: (options?: any) => Promise<any>;
    getByTicket: (ticket: string) => Promise<any>;
    save: (data: any, options: any) => Promise<any>;
    delete: (uid: string) => Promise<any>;

    archive: (uid: string) => Promise<any>;
    searchSuggestions: (search: string, locale?: string) => Promise<any>;
    calculateSizes: (width: number, aspect: string, unit: string, landscape: boolean) => any;
    addVote: (mapUid: string, userUid: string) => Promise<any>;
    removeVote: (mapUid: string, userUid: string) => Promise<any>;
    hasUserVoted: (mapUid: string, userUid: string) => Promise<boolean>;
    getVoteCount: (mapUid: string) => Promise<number>;
}

// Define una función de fábrica para crear configService
export const createMapService = () => {
    const map: iMap = {
        collection: new Items('mapster_maps'),
        _ppi: 300,
        _pxToCm: (px: number): number => {
            const inches = px / map._ppi;
            const cm = inches * 2.54;
            return Math.round(cm * 10) / 10;
        },
        _pxToIn: (px: number): number => {
            const inches = px / map._ppi;
            return Math.round(inches * 10) / 10;
        },
        _cmToPx: (cm: number): number => {
            const inches = cm / 2.54;
            return Math.round(inches * map._ppi);
        },
        getMap: async (uid: string, options?: any): Promise<any> => {
            if (!uid) return null;
            const result = await map.collection.find(uid, options);

            if (!result.success) return { success: false, message: result.message || 'error getting map' };
            return { success: true, data: result.data };
        },
        getMaps: async (options?: any): Promise<any> => {
            const result = await map.collection.get(options);
            return result;
        },
        getByTicket: async (ticket: string): Promise<any> => {
            if (!ticket) return { success: false, message: 'Ticket is required' };

            try {
                const filters = [{ key: 'ticket', operator: '==', value: ticket }];

                const result = await map.collection.get({ filters });

                if (!result.success) {
                    return { success: false, message: result.message || 'Error getting map by ticket' };
                }

                if (result.items.length === 0) {
                    return { success: false, message: 'Map not found' };
                }

                return { success: true, data: result.items[0] };
            } catch (error) {
                return { success: false, message: error instanceof Error ? error.message : String(error) };
            }
        },
        save: async (data: any, options: any): Promise<any> => {
            const result = await map.collection.save(data, options);
            return result;
        },
        delete: async (uid: string): Promise<any> => {
            const uidMap = cleanUid(uid);
            const result = await map.collection.find(uidMap);
            if (result.success) {
                const file = createFile();
                const dataMap = result.data;
                if (dataMap.file_map) file.delete(dataMap.file_map);
                if (dataMap.file_map_resized) file.delete(dataMap.file_map_resized);
                const resultDelete = await map.collection.delete(uidMap);
                return resultDelete;
            }

            return { success: false, message: 'Error deleting map' };
        },
        archive: async (uid: string): Promise<any> => {
            const result = await map.collection.delete(uid, { soft: true });
            return result;
        },
        searchSuggestions: async (search: string, locale: string = 'en'): Promise<any> => {
            const urlSearch = `https://nominatim.openstreetmap.org/search?format=json&q=${search}&accept-language=${locale}&limit=5&namedetails=1`;
            return await fetch(urlSearch).then(async res => {
                const results = await res.json();
                let resultsFilter = results.filter((item: { addresstype: string }) => item.addresstype !== 'village');
                resultsFilter = resultsFilter.filter(
                    (item: { display_name: any }, index: any, self: any[]) =>
                        self.findIndex(t => t.display_name === item.display_name) === index
                );
                return resultsFilter;
            });
        },
        calculateSizes(width, aspect = '1:1', unit = 'px', landscape = false) {
            if (aspect.indexOf(':') === -1) aspect = '1:1';

            let widthRatio = parseFloat(aspect.split(':')[0]);
            let heightRatio = parseFloat(aspect.split(':')[1]);

            if (landscape) {
                widthRatio = parseFloat(aspect.split(':')[1]);
                heightRatio = parseFloat(aspect.split(':')[0]);
            }

            const sizes: any = {
                width: width,
                height: (width * heightRatio) / widthRatio,
            };

            // Convertir siempre a cm
            if (unit === 'cm') {
                sizes.width = Math.ceil(map._pxToCm(sizes.width));
                sizes.height = Math.ceil(map._pxToCm(sizes.height));
            }

            if (unit === 'in') {
                sizes.width = Math.ceil(map._pxToIn(sizes.width));
                sizes.height = Math.ceil(map._pxToIn(sizes.height));
            }

            if (unit === 'px') {
                sizes.width = Math.round(sizes.width);
                sizes.height = Math.round(sizes.height);
            }

            return sizes;
        },

        // Vote management methods
        addVote: async (mapUid: string, userUid: string): Promise<any> => {
            try {
                // First check if user has already voted
                const hasVoted = await map.hasUserVoted(mapUid, userUid);
                if (hasVoted) {
                    return { success: false, message: 'User has already voted for this map' };
                }

                // Get current map data
                const mapResult = await map.getMap(mapUid);
                if (!mapResult.success) {
                    return { success: false, message: 'Map not found' };
                }

                const currentMap = mapResult.data;
                const currentVotes = currentMap.votes || 0;
                const currentVoters = currentMap.voters || [];

                // Add user to voters list and increment vote count
                const updatedVoters = [...currentVoters, userUid];
                const updatedVotes = currentVotes + 1;

                // Update the map with new vote data
                const updateResult = await map.collection.save({
                    uid: mapUid,
                    votes: updatedVotes,
                    voters: updatedVoters,
                });

                return updateResult;
            } catch (error) {
                console.error('Error adding vote:', error);
                return { success: false, message: error instanceof Error ? error.message : String(error) };
            }
        },

        removeVote: async (mapUid: string, userUid: string): Promise<any> => {
            try {
                // Get current map data
                const mapResult = await map.getMap(mapUid);
                if (!mapResult.success) {
                    return { success: false, message: 'Map not found' };
                }

                const currentMap = mapResult.data;
                const currentVotes = currentMap.votes || 0;
                const currentVoters = currentMap.voters || [];

                // Check if user has voted
                if (!currentVoters.includes(userUid)) {
                    return { success: false, message: 'User has not voted for this map' };
                }

                // Remove user from voters list and decrement vote count
                const updatedVoters = currentVoters.filter((voter: string) => voter !== userUid);
                const updatedVotes = Math.max(0, currentVotes - 1);

                // Update the map with new vote data
                const updateResult = await map.collection.save({
                    uid: mapUid,
                    votes: updatedVotes,
                    voters: updatedVoters,
                });

                return updateResult;
            } catch (error) {
                console.error('Error removing vote:', error);
                return { success: false, message: error instanceof Error ? error.message : String(error) };
            }
        },

        hasUserVoted: async (mapUid: string, userUid: string): Promise<boolean> => {
            try {
                const mapResult = await map.getMap(mapUid);
                if (!mapResult.success) {
                    return false;
                }

                const currentMap = mapResult.data;
                const voters = currentMap.voters || [];
                return voters.includes(userUid);
            } catch (error) {
                console.error('Error checking if user voted:', error);
                return false;
            }
        },

        getVoteCount: async (mapUid: string): Promise<number> => {
            try {
                const mapResult = await map.getMap(mapUid);
                if (!mapResult.success) {
                    return 0;
                }

                const currentMap = mapResult.data;
                return currentMap.votes || 0;
            } catch (error) {
                console.error('Error getting vote count:', error);
                return 0;
            }
        },
    };

    return map;
};
