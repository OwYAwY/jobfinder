import { NextMiddleware } from "puregram";
import { CommandContext } from "~/interfaces";

export async function initializeDataMiddlewares(ctx: CommandContext, next: NextMiddleware){
    // @ts-ignore
    ctx.dataMiddlewares = {};
    await next();
}