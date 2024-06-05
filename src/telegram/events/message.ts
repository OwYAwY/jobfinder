import { CommandContext } from "~/interfaces";
import { tg } from "~/instances";
import * as middleware from "../../middlewares/index.js";

tg.updates.on("message", middleware.initializeDataMiddlewares);
tg.updates.on("message", middleware.sanitizeFilterIncomingMessage);
tg.updates.on("message", middleware.parseAndExecuteCommands);
tg.updates.on("message", middleware.filterCommandAccess);


const handler = async(ctx: CommandContext)=>{
    console.log(ctx.dataMiddlewares);

    if(ctx.dataMiddlewares.isCommand){
        return await ctx.dataMiddlewares.command?.data.callback(ctx);
    }
    if(ctx.dataMiddlewares.isButton){
        return await ctx.dataMiddlewares.button?.data.callback(ctx);
    }
    return await ctx.send("сломалось");
}


export default handler;