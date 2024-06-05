import { NextMiddleware } from "puregram";
import { print } from "~/helpers";
import { client } from "~/instances";
import { CommandContext } from "~/interfaces";


export async function sanitizeFilterIncomingMessage(ctx: CommandContext, next: NextMiddleware) {
    if (!ctx.from) return;
    ctx.dataMiddlewares.isButton = false;
    ctx.dataMiddlewares.isCommand = false;

    const findUser = await client.user.findFirst({
        where: {
            tgId: ctx.from.id
        }
    }).catch((e) => {
        print("findUser", e);
        return null;
    });

    ctx.dataMiddlewares.userData = findUser;

    await next();
}