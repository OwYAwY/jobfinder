import fs from 'fs';
import { tg } from '~/instances/tg';
import { __rootdir, print } from '~/helpers';
import { CommandCallbackContext, CommandContext } from '~/interfaces';
import { CallbackQueryContext, MessageContext } from 'puregram';

// Types
type TEvents = CommandContext | MessageContext | CallbackQueryContext | CommandCallbackContext;
export type TTGCallbackEvent = (ctx: TEvents) => Promise<void | TEvents>;

interface IList {
  [name: string]: TTGCallbackEvent
}

class Events {
  static instance: null | Events = null;
  private _list: IList = {};

  constructor() {
    if(!Events.instance) {
      Events.instance = this;
    } else {
      return Events.instance;
    }
  }

  public register(name: string, callback: TTGCallbackEvent) {
    this._list[name] = callback;
  }

  public async init() {
    const loaded = {
      all: 0,
      success: 0,
      failed: 0
    };

    print('TG Events', 'The beginning of receiving information');

    const dir = __rootdir + '/src/telegram/events/';
    const files = fs.readdirSync(dir)
      .filter(name => name.endsWith('.ts'));

    loaded.all = files.length;


    for(const file of files) {
      const name = file.split('.ts')[0];

      try {
        const module = await import('file://' + dir + file);
        tg.updates.on(name, module.default);

        print('TG Events', `Event ${ name } is loaded`);
        loaded.success++;
      }catch (e) {
        console.log(e);
        print('TG Events', `Events ${ name } loading error: ${ e }`);
        loaded.failed++;
      }
    }

    print('TG Events', `Events received successfully [All: ${ loaded.all } | Success: ${ loaded.success } | Failed: ${ loaded.failed }]`);
  }

  public get list() {
    return this._list;
  }

}

export const TGEvents = new Events();