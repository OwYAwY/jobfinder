import { ParseMode, Telegram } from "puregram";
import { TG_TOKEN } from "../envs.js";
import { print } from "~/helpers";
import { SceneManager } from "@puregram/scenes";
import { session } from "@puregram/session";


export const sceneManager = new SceneManager();
const tg = new Telegram({
    token: TG_TOKEN
});

tg.updates.use(session());
tg.updates.on("message", sceneManager.middleware);
tg.updates.on("message", sceneManager.middlewareIntercept);



tg.onBeforeRequest((ctx) => {
    if(ctx.path === 'sendMessage'){
        ctx.params.parse_mode = ParseMode.HTML;
        ctx.params.disable_web_page_preview = true;
    }
    
    return ctx
});

tg.updates.use(async(ctx,next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    print('Debug', `Event ${ctx.updateId ?? "unknown"} processed in ${end - start}ms`);
});

export { tg };
//AgACAgIAAxkBAAIDKmZgomAP9rIobE0YYBYrDblgGlYJAALG2zEbSYkISx2t-qRdJCg0AQADAgADcwADNQQ
// '<code>huy</code>';
// '<pre lang="eng">ffds</pre>'