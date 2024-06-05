import { CommandContext } from "~/interfaces";
import { TGCommands } from "../commands.js";
import { StepContext } from "@puregram/scenes";
import { mainKeyboard } from "~/helpers";

const callback = async (ctx:CommandContext & StepContext) =>{
    if(ctx.dataMiddlewares.userData){
        return await ctx.send('У тебя есть аккаунт',{
            reply_markup: mainKeyboard
        });
    }
    return ctx.scene.enter("signup");
}
TGCommands.register("start", {
    description: "старт",
    category: "all",
    // @ts-ignore
    callback
});