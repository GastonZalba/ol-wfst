import { I18n } from '../../@types';
export * from './es';
export * from './en';
export * from './zh';

import { es } from './es';
import { en } from './en';
import { zh } from './zh';

const langs = {
    es,
    en,
    zh
};

// Set default Language
export let I18N: I18n = en;

export const setLang = (lang = 'en', customI18n: I18n = null): void => {
    // Check if language exists
    if (lang in langs) {
        I18N = langs[lang];
    }

    // Check if customs translations are provided
    if (customI18n) {
        I18N = { ...I18N, ...customI18n };
    }
};

/**
 * /**
 * For translations thas has a variable "{}"" to be replaced inside
 * @param string
 * @param args
 * @returns
 */
export const I18N_ = (string: string, ...args: any): string => {
    let text = I18N[string];

    if (!text) {
        console.error('Translation not found', string);
        text = string;
    }

    if (args.length) {
        args.forEach((arg) => {
            text = text.replace(/{}/, arg);
        });
    }

    return text;
};
