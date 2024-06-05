import { NextMiddleware } from "puregram";
import { CommandContext } from "~/interfaces";

export async function filterCommandAccess(ctx: CommandContext, next: NextMiddleware) {
    
    const data = ctx.dataMiddlewares;
    const command = data.command?.data;
    const button = data.button?.data;
    const category = command?.category ?? button?.category ?? "";
    if (["admin","registered"].includes(category)){
        const userData = data.userData;
        if(!userData || (!userData.isAdmin && category == "admin")) {
            return await ctx.send("Данное действие вам недоступно");
        }
    }
    await next();
}