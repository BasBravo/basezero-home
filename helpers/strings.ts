export function objectToStringLines(obj: any) {
    return Object.keys(obj)
        .map((key: string) => `${key}: ${obj[key]}`)
        .join('\n');
}

export function arrayOfObjectsToString(obj: any) {
    // cada objecto tiene key, value
    return obj.map((item: any) => `${item.key}: ${item.value}`).join('\n');
}

/**
 * Separates a string by spaces and returns an array of strings capitalized
 *
 * @export
 * @param {string} str
 * @return {*}
 */
export function capitalize(str: string | null) {
    if (!str || str == '') return '';
    const phrases = str.split('. ');

    phrases.forEach((phrase: string, index: number) => {
        phrase = phrase.toLowerCase();
        phrases[index] = phrase.charAt(0).toUpperCase() + phrase.slice(1);
    });

    return phrases.join('. ');
}

/**
 * Returns a uid without the first part if it exists
 *
 * @export
 * @param {string} uid
 * @return {*}
 */
export function cleanUid(uid: string | null): string {
    if (typeof uid === 'object') return uid;
    if (!uid || uid === '' || uid === 'undefined') return null;
    if (uid.includes('/')) uid = uid.split('/')[1];
    return uid ?? '';
}

/**
 * Returns the string in format slug
 *
 * @export
 * @param {string} text
 * @return {*}
 */
export function slugify(text: string) {
    return text
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
}

/**
 * Returns the string in format slug
 *
 * @export
 * @param {string} text
 * @return {*}
 */
export function toCamelCase(text: string) {
    return text
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[^a-zA-Z0-9_ ]/g, '') // Eliminar caracteres especiales, excepto guiones bajos
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        })
        .replace(/\s+/g, ''); // Eliminar los espacios
}

export function cleanSpecialChars(text: string) {
    return text
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[^a-zA-Z0-9_ ]/g, '') // Eliminar caracteres especiales, excepto guiones bajos
        .replace(/\s+/g, ''); // Eliminar los espacios
}

/**
 * Returns a random string
 *
 * @export
 * @param {number} length
 * @return {*}
 */
export function randomString(length: number = 10) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function generateUID(length: number = 10) {
    // Caracteres permitidos en el UID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';

    // Genera el UID concatenando caracteres aleatorios
    for (let i = 0; i < length; i++) {
        uid += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return uid;
}
