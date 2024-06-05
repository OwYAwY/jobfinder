import { KeyboardBuilder } from "puregram";

export const mainKeyboard = new KeyboardBuilder()
  .resize()
  .textButton("Моя анкета")
  .textButton("Смотреть анкеты");
export const reactKeyboard = new KeyboardBuilder()
  .resize()
  .textButton("👍")
  .textButton("👎")
  .textButton("⏱");
