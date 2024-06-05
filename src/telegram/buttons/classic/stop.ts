import { mainKeyboard, react, showProfile } from "~/helpers";
import { CommandContext } from "~/interfaces";
import { TGButtons } from "~/telegram/buttons";

const callback = async (ctx:CommandContext) =>{
    const me = ctx.dataMiddlewares.userData;
    if(!me) return;
    return await ctx.send("Поиск остановлен", {
        reply_markup: mainKeyboard
    })    
}
TGButtons.register("stop", {
    description: "стопт",
    category: "registered",
    alias: ["⏱"],
    // @ts-ignore
    callback
});