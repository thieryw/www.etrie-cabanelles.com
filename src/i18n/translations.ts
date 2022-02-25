/*import { symToStr } from "tsafe/symToStr";
import { Reflect } from "tsafe/Reflect";*/
import { id } from "tsafe/id";
import type { Language } from "./Language";


export type Scheme = {
    [key: string]: undefined | Record<string, string>;
};

type ToTranslations<S extends Scheme> = {
    [key in keyof S]: string;
};

const reflectedI18nSchemes = {
};

export type I18nSchemes = typeof reflectedI18nSchemes;

export type Translations = {
    [K in keyof I18nSchemes]: ToTranslations<I18nSchemes[K]>;
};

export const translations = id<Record<Language, Translations>>({
    "en": {
    },

    "fr": {

    }
});