import { User } from "@prisma/client";
import { from } from "env-var";
import { MediaSource } from "puregram";
import { EXPERIENCE } from "~/envs";
import { client, tg } from "~/instances";
import { CommandContext } from "~/interfaces";
import { TMedia } from "~/types";


export const showProfile = async(ctx: CommandContext, user: User | null, chat: number | null = null) => {
    if(!user || !ctx.from?.id) return false;
    const formText:any[] = [];
    const prof = await client.profession.findFirst({
        where:{
            id: user.profession
        }
    });
    switch(user.type){
        case 0: {
            formText.push("Имя: " + user.name);
            formText.push("Возраст: " + user.age);
            formText.push("Пол: " + (user.sex == 1 ? "Мужской" : "Женский"));
            formText.push("Опыт работы: " + EXPERIENCE[user.experience]);
            formText.push("Проф. Сфера: " + prof?.name ?? "id: " + user.profession);
            break;
        }
        case 1: {
            formText.push("Название компании: " + user.name);
            formText.push("Минимальный возраст кандидатов: " + user.age);
            formText.push("Требуемый опыт работы: " + EXPERIENCE[user.experience]);
            formText.push("Проф. Сфера: " + prof?.name ?? "id: " + user.profession);
            break
        }
    }

    const mediaCheck:TMedia[] = (user.image ?? [{
        type: "photo",
        media: MediaSource.fileId("AgACAgIAAxkBAAIDKmZgomAP9rIobE0YYBYrDblgGlYJAALG2zEbSYkISx2t-qRdJCg0AQADAgADcwADNQQ")
    }]) as TMedia[];
    mediaCheck[0].caption = formText.join("\n");
    mediaCheck[0].parse_mode = "HTML";
    return await tg.api.sendMediaGroup({
        media: mediaCheck,
        chat_id: chat ?? ctx.chatId
    }).then(()=> true).catch(() => false);
}