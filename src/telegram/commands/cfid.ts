import { CommandContext } from "~/interfaces";
import { TGCommands } from "../commands.js";

const callback = async (ctx:CommandContext) =>{
    return await ctx.send("диалог id:" + ctx.chatId);
}
TGCommands.register("cfid", {
    description: "узнать id текущего диалога",
    category: "all",
    // @ts-ignore
    callback
});