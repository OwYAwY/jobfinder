import { User } from "@prisma/client";
import { client, tg } from "~/instances";
import { CommandContext } from "~/interfaces";
import { showProfile } from "./showprofile.js";
import { resetCurrent } from "./resetCurrent.js";

export const react = async(ctx: CommandContext, userId: number, type: boolean) => {
    const me = ctx.dataMiddlewares.userData;
    const user = await client.user.findFirst({
        where: {
            id: userId
        }
    })
    if(!me || !user) return false;
    const reaction = await client.reaction.create({
        data: {
            user: me.id,
            reacted: user.id,
            type
        }
    }).then(()=> true).catch(() => false);
    if(!reaction) return false;
    if(!type) return true;
    await showProfile(ctx, me, Number(user.tgId));
    await resetCurrent(me.id);
    return await tg.api.sendMessage({
        chat_id: Number(user.tgId),
        text: 'Ваша анкета кого-то заинтересовала - <a href="' + (me.tgNick ? `t.me/${me.tgNick}` : `tg://user?id=${me.tgId}`) + '">' + me.name + '</a>',
        parse_mode: "HTML"
    }).then(() => true).catch(() => false);
}