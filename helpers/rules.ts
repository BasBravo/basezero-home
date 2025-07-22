/**
 * This function get the validation rules from a model searching in the inputs object the validation attribute
 * @param model the model to get the rules
 * @returns
 */
export const getRules = (model: any) => {
    const rules: any = {};
    model.inputs.forEach((input: { validation: any; name: string | number }) => {
        if (input.validation) rules[input.name] = input.validation;
    });

    return rules;
};
export function validateZipCode(cif: string, _modelParam?: any): boolean {
    const postalCode = String(cif);

    const isFiveDigits = /^\d{5}$/.test(postalCode);
    if (!isFiveDigits) return false;
    const postalNumber = parseInt(postalCode, 10);
    return postalNumber >= 1000 && postalNumber <= 52999;
}
export function validateCifCode(cif: string, modelParam?: any): boolean {
    const countryCode = modelParam.country ?? 'es';
    // Eliminar espacios en blanco y convertir a mayúsculas
    cif = cif.trim().toUpperCase();

    // Expresión regular para validar CIF en España
    const cifRegex: { [key: string]: RegExp } = {
        es: /^[ABCDEFGHJKLMNPQRSUVW][0-9]{7}[0-9A-J]$/,
        uk: /^[0-9]{9}$/,
    };
    // Validar el formato del CIF
    if (!cifRegex[countryCode].test(cif)) {
        return false;
    }

    // Obtener la letra de control del CIF
    const letraControl: string = cif.charAt(8);

    // Obtener los dígitos del CIF
    const digitosCIF: string = cif.substr(1, 7);

    // Calcular el dígito de control del CIF
    let suma: number = 0;
    for (let i: number = 0; i < digitosCIF.length; i++) {
        let digito: number = parseInt(digitosCIF.charAt(i), 10);
        if (i % 2 === 0) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }
        suma += digito;
    }

    // Ajustar el dígito de control si es 10
    const digitoControlCalculado: number = (10 - (suma % 10)) % 10;

    // Convertir la letra de control a código ASCII
    const asciiLetraControl: number = letraControl.charCodeAt(0);

    // Verificar si el dígito de control calculado coincide con la letra de control
    if ((asciiLetraControl >= 65 && asciiLetraControl <= 90) || asciiLetraControl === digitoControlCalculado + 48) {
        return true;
    }

    return false;
}

export function validatePhoneNumber(telefono: string): boolean {
    if (telefono == '' || !telefono) return true;
    // Eliminar espacios en blanco y caracteres especiales
    telefono = telefono.replace(/\s+/g, '');

    // Expresión regular para validar números de teléfono con o sin código de país
    const telefonoRegex: RegExp = /^(\+|00)?(34)?[6-9]\d{8}$/;

    // Validar el formato del número de teléfono
    return telefonoRegex.test(telefono);
}
/**
 * This function check if the value is a valid IBAN
 * @param value the value to check
 * @returns
 */
export const isIban = (IBAN: string) => {
    if (!IBAN) return true;
    IBAN = IBAN.toUpperCase().trim().replace(/\s/g, '');

    let letter_1 = '';
    let letter_2 = '';
    let num_1 = 0;
    let num_2 = 0;
    let isbanaux = '';

    // Se comprueba que el campo no esté vacío y que tenga 24 caracteres
    if (IBAN.length != 24) return false;

    // Se coge las primeras dos letras y se pasan a números
    letter_1 = IBAN.substring(0, 1);
    letter_2 = IBAN.substring(1, 2);
    num_1 = getnumIBAN(letter_1);
    num_2 = getnumIBAN(letter_2);

    // Se sustituye las letras por números.
    isbanaux = String(num_1) + String(num_2) + IBAN.substring(2);

    // Se mueve los 6 primeros caracteres al final de la cadena.
    isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);

    // Se calcula el resto, llamando a la función modulo97, definida más abajo
    const rest = module97(isbanaux);

    if (Number(rest) === 1) return true;
    return false;
};

function module97(iban: string) {
    const parts = Math.ceil(iban.length / 7);
    let remainer = '';

    for (let i = 1; i <= parts; i++) {
        remainer = String(parseFloat(remainer + iban.substr((i - 1) * 7, 7)) % 97);
    }

    return remainer;
}

function getnumIBAN(letter: string) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters.search(letter) + 10;
}
