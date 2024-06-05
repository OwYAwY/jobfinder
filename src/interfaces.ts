import { User } from '@prisma/client';
import { CallbackQueryContext, MessageContext } from 'puregram';
import { TCategory } from './types.js';
import { TTGCallbackCommand } from './telegram/commands.js';
import { TTGCallbackEvent } from './telegram/events.js';

export interface ICommand {
  name: string,
  args: (string | number)[],
  data: ITGCommand
}
export interface IButton {
  name: string,
  data: ITGButton
}

export interface CommandContext extends MessageContext {
  dataMiddlewares: {
      userData: null | User,
      isCommand: boolean,
      isButton: boolean,
      command?: ICommand,
      button?: IButton
  }
}

export interface ICallbackButton {
  name: string,
  data?: ITGCallbackButton
}

export interface CommandCallbackContext extends CallbackQueryContext {
  dataMiddlewares: {
    userData: null | User,
    data: ICallbackButton
  }
}

export interface ITGCommand {
  description: string;
  category: TCategory;
  callback: TTGCallbackCommand;

  args?: string;
  alias?: string[];
  examples?: string[];
  disabled?: boolean;
  onlyConference?: boolean;
}

export interface ITGButton {
  description: string;
  category: TCategory;
  callback: TTGCallbackCommand;

  alias?: string[]; // То, что видит пользователь
  disabled?: boolean;
  onlyConference?: boolean;
}

export interface ITGCallbackButton {
  description: string;
  category: TCategory;
  callback: TTGCallbackEvent;

  alias?: string[]; // То, что видит пользователь
  disabled?: boolean;
  onlyConference?: boolean;
}