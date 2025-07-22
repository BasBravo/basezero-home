interface objectsOptions {
    data: any;
    separator?: string;
    excludes?: string[];
}

/**
 * Convert object with points in keys into object with nested objects
 *
 * @export
 * @param {*} obj
 * @return {*}
 */
export function toObjectWithNestedObjects(options: objectsOptions): any {
    if (options === null || options === undefined || options.data === null || options.data === undefined) return null;

    const { data, separator = '.', excludes = [] } = options;

    if (data === null || data === undefined) return null;

    const newObj: any = {};

    Object.keys(data).forEach((key: string) => {
        if (!excludes.includes(key)) {
            const keys = key.split(separator);
            let current = newObj;
            for (let i = 0; i < keys.length; i++) {
                current[keys[i]] = current[keys[i]] ?? {};
                if (i === keys.length - 1) {
                    current[keys[i]] = data[key];
                }
                current = current[keys[i]];
            }
        }
    });

    return newObj;
}

/**
 * Convert object with nested objects into object with points in keys
 *
 * @export
 * @param {*} obj
 * @return {*}
 */
export function toObjectWithPointsInKeys(options: objectsOptions): any {
    if (options === null || options === undefined || options.data === null || options.data === undefined) return null;

    const { data, separator = '.', excludes = [] } = options;

    if (data === null || data === undefined) return null;

    const newObj: any = {};

    Object.keys(data).forEach((key: string) => {
        if (key.startsWith('_')) {
            newObj[key] = data[key];
            return;
        }

        // if last in '_at' then it is a date field and should be kept as is
        if (key.endsWith('_at')) {
            newObj[key] = data[key];
            return;
        }

        if (!Array.isArray(data[key]) && typeof data[key] === 'object') {
            if (excludes.includes(key)) newObj[key] = data[key];
            else {
                const nested = toObjectWithPointsInKeys({ data: data[key], separator, excludes });
                if (nested === null || nested === undefined) return;
                Object.keys(nested).forEach((nestedKey: string) => {
                    newObj[`${key}${separator}${nestedKey}`] = nested[nestedKey];
                });
            }
        } else {
            newObj[key] = data[key];
        }
    });

    return newObj;
}

export function areEqualObjects(obj1: any, obj2: any): boolean {
    const obj1String = JSON.stringify(toObjectWithPointsInKeys(obj1));
    const obj2String = JSON.stringify(toObjectWithPointsInKeys(obj2));

    if (obj1String !== obj2String) return false;

    return true;
}

export function checkChanges(oldData: any, newData: any): any[] {
    const changes: any[] = [];

    // Eliminar propiedades que no queremos comprobar
    delete newData?.created_at;
    delete newData?.updated_at;

    for (const key in newData) {
        if (Object.prototype.hasOwnProperty.call(newData, key)) {
            // const element = newData[key];

            if (typeof oldData === 'object') {
                // Si es un objeto, comprobar sus propiedades
                if (!oldData || !(key in oldData) || oldData[key] == null) continue;
                const subChanges = checkChanges(oldData[key], newData[key]);
                if (subChanges.length > 0) {
                    subChanges.forEach((subChange: { key: any; old: any; new: any }) => {
                        changes.push({ key: `${key}.${subChange.key}`, old: subChange.old ?? null, new: subChange.new ?? null });
                    });
                }
            } else {
                // Si no es un objeto, comprobar si ha cambiado
                if (!oldData || oldData[key] == null) continue;
                if (oldData[key] != newData[key]) {
                    changes.push({ key, old: oldData[key] ?? null, new: newData[key] ?? null });
                }
            }
        }
    }

    return changes;
}

export function transformToKeyValue(items: any[], prefix?: string): any[] {
    const resultItems: any[] = [];

    if (items === null || items === undefined) return resultItems;

    items.forEach((item: any) => {
        let value = '';
        if ('name' in item) value = item.name;
        if ('first_name' in item) value = `${item.first_name} ${item.last_name || ''} (${item.email || ''})`;

        resultItems.push({
            key: (prefix || '') + item.uid,
            value,
        });
    });

    return resultItems;
}

export function flattenObject(obj: any, prefix = '', res: Record<string, any> = {}) {
    for (const key in obj) {
        const val = obj[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (Array.isArray(val)) {
            res[prefixedKey] = val; // Deja el array tal cual
        } else if (typeof val === 'object' && val !== null) {
            flattenObject(val, prefixedKey, res);
        } else {
            res[prefixedKey] = val;
        }
    }
    return res;
}
