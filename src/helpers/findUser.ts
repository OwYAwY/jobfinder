import { User } from "@prisma/client";
import { client } from "~/instances";
import { CommandContext } from "~/interfaces";



export const findUser = async(ctx: CommandContext) => {
    if(!ctx || !ctx.from?.id || !ctx.dataMiddlewares.userData){
        return null;
    }
    const me = ctx.dataMiddlewares.userData;
    const findUsers = await client.user.findMany({
        where: {
            profession: me.profession,
            type: +!(me.type)
        }
    });

    const filteredUsers:User[] = [];
    if(!findUsers) return null;
    for(const user of findUsers){
        if(me.type == 1){ // 1 - компания
            if(user.age < me.age) continue;
            if(user.experience < me.experience) continue;
        }
        else{
            if(user.age > me.age) continue;
            if(user.experience > me.experience) continue;
        }
        const isReacted = await client.reaction.count({
            where: {
                OR: [
                    {
                        user: me.id,
                        reacted: user.id
                    },
                    {
                        user: user.id,
                        reacted: me.id
                    },
                ]
            }
        })
        console.log(isReacted);
        if (isReacted) continue;
        filteredUsers.push(user);
    }
    if(!filteredUsers.length) return null;
    return filteredUsers[Math.floor(Math.random()*filteredUsers.length)];
}