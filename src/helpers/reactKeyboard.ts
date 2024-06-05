import { CommandContext } from "~/interfaces";
import { reactKeyboard } from "./keyboards.js";

export const reactKey = async(ctx: CommandContext) => {
    return await ctx.send("✔",{
        reply_markup: reactKeyboard 
    })
}