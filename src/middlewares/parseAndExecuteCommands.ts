import { NextMiddleware } from "puregram";
import { CommandContext } from "~/interfaces";
import { TGButtons } from "~/telegram/buttons";
import { TGCommands } from "~/telegram/commands";

export async function parseAndExecuteCommands(ctx: CommandContext, next: NextMiddleware) {
    
    if(!ctx.text) return;
    if (ctx.entities){
        const command = ctx.entities.find((i) => i.type == "bot_command");
        if(command && command.offset === 0){
            const name = ctx.text.slice(command.offset+1, command.offset+command.length+1).trim() as string;
            const args = ctx.text.slice(command.offset + command.length+1).trim().split(/\s+/) as string[];
            const [cmdName, data] = TGCommands.getCommand(name);
            if (!cmdName || !data) return;
            ctx.dataMiddlewares.isCommand = true;
            ctx.dataMiddlewares.command = {
                name, args, data
            }
        }
    }else{
        const [name, data] = TGButtons.getButton(ctx.text);
        if(!name || !data){
            return await ctx.send("Не удалось выполнить действие, попробуйте позже");
        }
        ctx.dataMiddlewares.isButton = true;
        ctx.dataMiddlewares.button ={
            name, data
        }
    }
    await next();
}