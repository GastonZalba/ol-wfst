import { I18n } from '../../@types';
export * from './es';
export * from './en';
export * from './zh';
export declare let I18N: I18n;
export declare const setLang: (lang?: string, customI18n?: I18n) => void;
/**
 * /**
 * For translations thas has a variable "{}"" to be replaced inside
 * @param string
 * @param args
 * @returns
 */
export declare const I18N_: (string: string, ...args: any) => string;
//# sourceMappingURL=index.d.ts.map