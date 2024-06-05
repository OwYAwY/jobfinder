import { TelegramInputMediaPhoto, TelegramInputMediaVideo } from 'puregram/generated';

export type TCategory = 'all' | 'admin' | 'registered';
export type TArg = string | number;
export type TMedia = TelegramInputMediaPhoto | TelegramInputMediaVideo