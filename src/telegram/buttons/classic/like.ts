import { findUser, mainKeyboard, react, resetCurrent, showProfile } from "~/helpers";
import { reactKey } from "~/helpers/reactKeyboard";
import { client } from "~/instances";
import { CommandContext } from "~/interfaces";
import { TGButtons } from "~/telegram/buttons";

const callback = async (ctx:CommandContext) =>{
    const me = ctx.dataMiddlewares.userData;
    if(!me) return;
    if(me.currentUser === -1){
        return await ctx.send("Вы сейчас никого не ищете",{
            reply_markup: mainKeyboard
        })
    }
    await react(ctx, me.currentUser, true);
    const user = await findUser(ctx);
    if(!user){
        await resetCurrent(me.id);
        return await ctx.send("Нет подходящих предложений");
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
TGButtons.register("like", {
    description: "старт",
    category: "registered",
    alias: ["👍"],
    // @ts-ignore
    callback
});