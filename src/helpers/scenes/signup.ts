import { StepScene } from "@puregram/scenes";
import { accessSync } from "fs";
import { KeyboardBuilder, MediaSource } from "puregram";
import { EXPERIENCE } from "~/envs";
import { client, sceneManager } from "~/instances";
import { mainKeyboard } from "../keyboards.js";


const signUpScene = new StepScene("signup", [
  async (ctx) => {
    const keyboard = new KeyboardBuilder()
      .oneTime()
      .textButton("Работник")
      .textButton("Работодатель")
      .resize();
    if (ctx.scene.step.firstTime) {
      const findMe = await client.user.findFirst({
        where: {
          tgId: ctx.from?.id,
        },
      });
      if (findMe) {
        await ctx.send("Ты уже зарегистрирован");
        return ctx.scene.leave();
      }
      return ctx.send("Выберите кто вы: работник или работодатель?", {
        reply_markup: keyboard,
      });
    }

    if (!ctx.text || !["Работник", "Работодатель"].includes(ctx.text)) {
      return await ctx.send("Неверная категория, нажмите на одну из кнопок", {
        reply_markup: keyboard,
      });
    }
    ctx.scene.state.type = +(ctx.text == "Работодатель");
    return ctx.scene.step.next();
  },
  async (ctx) => {
    switch (ctx.scene.state.type) {
      case 0: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send("Введите ваше имя");
        }
        if (!ctx.text || !isNaN(+ctx.text)) return ctx.send("Неверное значение имени");
        ctx.scene.state.name = ctx.text;
        return ctx.scene.step.next();
      }
      case 1: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send("Введите название вашей компании");
        }
        if (!ctx.text || !isNaN(+ctx.text)) return ctx.send("Неверное значение названия");
        ctx.scene.state.name = ctx.text;
        return ctx.scene.step.next();
      }
    }
  },
  async (ctx) => {
    switch (ctx.scene.state.type) {
      case 0: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send("Введите ваш возраст");
        }
        if (!ctx.text || isNaN(+ctx.text))
          return ctx.send("Некорректное значение возраста");
        ctx.scene.state.age = +ctx.text;
        return ctx.scene.step.next();
      }
      case 1: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send("Введите минимальный возраст кандидатов");
        }
        if (!ctx.text || isNaN(+ctx.text))
          return ctx.send("Некорректное значение возраста");
        ctx.scene.state.age = +ctx.text;
        return ctx.scene.step.next();
      }
      default:
        return ctx.scene.step.next();
    }
  },
  async (ctx) => {
    const keyboard = new KeyboardBuilder()
      .oneTime()
      .textButton("Мужской")
      .textButton("Женский")
      .resize();
    switch (ctx.scene.state.type) {
      case 0: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send("Какой у вас пол?", {
            reply_markup: keyboard,
          });
        }
        if (!ctx.text || !["Мужской", "Женский"].includes(ctx.text)) {
          return await ctx.send("Неверный пол, нажмите на одну из кнопок", {
            reply_markup: keyboard,
          });
        }
        ctx.scene.state.sex = +(ctx.text == "Мужской");
        return ctx.scene.step.next();
      }
      default:
        return ctx.scene.step.next();
    }
  },
  async (ctx) => {
    const keyboard = new KeyboardBuilder().oneTime().resize();
    for (const exp in EXPERIENCE) {
      keyboard.textButton(EXPERIENCE[exp]);
      if (+exp % 2 == 0) {
        keyboard.row();
      }
    }
    switch (ctx.scene.state.type) {
      case 0: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send("Какой у вас опыт работы?", {
            reply_markup: keyboard,
          });
        }
        if (!ctx.text || !EXPERIENCE.includes(ctx.text))
          return await ctx.send(
            "Неверный опыт работы, пожалуйста выберите из доступных кнопок",
            {
              reply_markup: keyboard,
            }
          );
        ctx.scene.state.experience = EXPERIENCE.indexOf(ctx.text);
        return ctx.scene.step.next();
      }
      case 1: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send("Какой опыт работы кандидатов минимален?", {
            reply_markup: keyboard,
          });
        }
        if (!ctx.text || !EXPERIENCE.includes(ctx.text))
          return await ctx.send(
            "Неверный опыт работы, пожалуйста выберите из доступных кнопок",
            {
              reply_markup: keyboard,
            }
          );
        ctx.scene.state.experience = EXPERIENCE.indexOf(ctx.text);
        return ctx.scene.step.next();
      }
    }
  },
  async (ctx) => {
    const keyboard = new KeyboardBuilder().oneTime().resize();
    const proffesions = await client.profession.findMany();
    proffesions.forEach((p, i) => {
      if (!p.name) return;
      keyboard.textButton(p.name);
      if (i % 3 == 0) {
        keyboard.row();
      }
    });
    switch (ctx.scene.state.type) {
      case 0: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send(
            "Выберите сферу вашей профессиональной деятельности",
            {
              reply_markup: keyboard,
            }
          );
        }
        const filteredProfessions = proffesions.find((i) => i.name == ctx.text);
        if (!ctx.text || !filteredProfessions) {
          return ctx.send("Недоступная сфера, выберите из списка кнопок", {
            reply_markup: keyboard,
          });
        }
        ctx.scene.state.sphere = filteredProfessions?.id;
        return ctx.scene.step.next();
      }
      case 1: {
        if (ctx.scene.step.firstTime) {
          return await ctx.send(
            "Выберите сферу вашей деятельности вашей компании",
            {
              reply_markup: keyboard,
            }
          );
        }
        const filteredProfessions = proffesions.find((i) => i.name == ctx.text);
        if (!ctx.text || !filteredProfessions) {
          return ctx.send("Недоступная сфера, выберите из списка кнопок", {
            reply_markup: keyboard,
          });
        }
        ctx.scene.state.sphere = filteredProfessions?.id;
        return ctx.scene.step.next();
      }
    }
  },
  async (ctx) => {
    switch(ctx.scene.state.type){
        case 0:{
            const keyboard = new KeyboardBuilder()
            .oneTime()
            .textButton("Пропустить")
            .resize()
            if(ctx.scene.step.firstTime){
                return await ctx.send("Отправьте вашу фотографию", {
                    reply_markup: keyboard
                });
            }
            if(ctx.text == "Пропустить") return ctx.scene.step.next();
            ctx.scene.state.pics = [];
            if(ctx.photo){
                ctx.scene.state.pics.push({
                    type: "photo",
                    media: MediaSource.fileId(ctx.photo[0].fileId)
                })
            }else{
                return await ctx.send("Необходимо загрузить только фото или пропустить этот этап",{
                    reply_markup:keyboard
                })
            }
            return ctx.scene.step.next();
        }
        case 1: {
            const keyboard = new KeyboardBuilder()
            .oneTime()
            .textButton("Пропустить")
            .resize()
            if(ctx.scene.step.firstTime){
                return await ctx.send("Отправьте логотип вашей компании", {
                    reply_markup: keyboard
                });
            }
            if(ctx.text == "Пропустить") return ctx.scene.step.next();
            ctx.scene.state.pics = [];
            if(ctx.photo){
                ctx.scene.state.pics.push({
                    type: "photo",
                    media: MediaSource.fileId(ctx.photo[0].fileId)
                })
            }else{
                return await ctx.send("Необходимо загрузить только фото или пропустить этот этап",{
                    reply_markup:keyboard
                })
            }
            return ctx.scene.step.next();
        }
    }

  },
  async(ctx) =>{
    await client.user.create({
        data: {
            tgId: ctx.from?.id,
            tgNick: ctx.from?.username,
            type: ctx.scene.state.type,
            name: ctx.scene.state.name,
            age: ctx.scene.state.age,
            sex: ctx.scene.state.sex,
            experience: ctx.scene.state.experience,
            profession: ctx.scene.state.sphere,
            image: ctx.scene.state.pics ?? [{
              type: "photo",
              media: MediaSource.fileId("AgACAgIAAxkBAAIDKmZgomAP9rIobE0YYBYrDblgGlYJAALG2zEbSYkISx2t-qRdJCg0AQADAgADcwADNQQ")
          }]
        }
    })
    await ctx.send("Успешная регистрация!",{
        reply_markup: mainKeyboard
    })
    return ctx.scene.leave();
  }
]);
sceneManager.addScenes([
    signUpScene
]);
  
