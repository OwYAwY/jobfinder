import { config } from 'dotenv';
import env from 'env-var';

const { get } = env;

const envFilePath = '.env.' + process.env.NODE_ENV;

config({
    path: envFilePath
})

export const TG_TOKEN = get('TG_TOKEN').required().asString();

export const EXPERIENCE = ["Без опыта", "1-5 лет","более 5 лет"];