import { findUser, resetCurrent, showProfile } from "~/helpers";
import { reactKey } from "~/helpers/reactKeyboard";
import { client } from "~/instances";
import { CommandContext } from "~/interfaces";
import { TGButtons } from "~/telegram/buttons";

const callback = async (ctx:CommandContext) =>{
    const user = await findUser(ctx);
    const me = ctx.dataMiddlewares.userData;
    if(!me) return;
    if(!user){
        await resetCurrent(me.id);
        return await ctx.send("Пока что больше нет подходящих предложений");
    }
    await client.user.update({
        where: {
            id: me?.id
        },
        data: {
            currentUser: user.id
        }
    })
    await reactKey(ctx);
    await showProfile(ctx, user);
}
TGButtons.register("watch", {
    description: "смотреть анкеты",
    category: "registered",
    alias: ["смотреть анкеты"],
    // @ts-ignore
    callback
});