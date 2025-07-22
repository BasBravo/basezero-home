// IMPORTS ////////////////////////////////////
import { createI18n } from 'vue-i18n';
import en from '~~/i18n/locales/en';
import es from '~~/i18n/locales/es';
import { capitalize } from '~~/helpers';
//
// INTERFACE
//
export interface iTranslate {
    locale: string;
    i18n: any;
    addMessages: (locale: string, messages: any) => void;
    t: (key: string) => string;
    tKeys: (values: any, capital?: boolean) => any;
    tValues: (values: any, capital?: boolean) => any;
}
//
// EXPORT
//
export const translate: iTranslate = {
    locale: typeof window !== 'undefined' ? localStorage.getItem('locale') ?? 'es' : 'es',

    i18n: createI18n({
        legacy: false,
        globalInjection: true,
        locale: typeof window !== 'undefined' ? localStorage.getItem('locale') ?? 'es' : 'es',
        messages: {
            en,
            es,
        },
    }),

    addMessages(locale: string, messages: any): void {
        this.i18n.global.mergeLocaleMessage(locale, messages);
    },

    t(key: string): string {
        return this.i18n.global.t(key);
    },

    tKeys(values: any, capital?: boolean): any {
        if (!capital) capital = true;
        const result: any = [];
        values.forEach((item: any) => {
            result.push({ key: item.key, value: capital ? capitalize(this.t(item.key)) : this.t(item.key) });
        });
        return result;
    },

    tValues(values: any, capital?: boolean): any {
        if (!capital) capital = true;
        const result: any = [];
        values.forEach((item: any) => {
            result.push({ key: item.key, value: capital ? capitalize(this.t(item.value)) : this.t(item.value) });
        });
        return result;
    },
};
