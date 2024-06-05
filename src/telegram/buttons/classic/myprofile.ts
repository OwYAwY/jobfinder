import { showProfile } from "~/helpers";
import { CommandContext } from "~/interfaces";
import { TGButtons } from "~/telegram/buttons";

const callback = async (ctx:CommandContext) =>{
    return showProfile(ctx, ctx.dataMiddlewares.userData);
}
TGButtons.register("myprofile", {
    description: "старт",
    category: "registered",
    alias: ["моя анкета"],
    // @ts-ignore
    callback
});