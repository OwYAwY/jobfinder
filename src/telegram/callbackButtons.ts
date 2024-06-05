import { __rootdir, print } from '~/helpers';
import fs from 'fs';
import { CommandCallbackContext, ITGCallbackButton } from '~/interfaces';

// Types
export type TTGCallbackCommand = (ctx: CommandCallbackContext) => Promise<void | CommandCallbackContext>;

// Interfaces
interface IList {
  [name: string]: ITGCallbackButton
}

// Class
class Buttons {
  static instance: null | Buttons = null;
  private _list: IList = { };

  constructor() {
    if (!Buttons.instance)
      Buttons.instance = this;
    else
      return Buttons.instance;
  }

  public register(name: string, params: ITGCallbackButton) {
    this._list[name] = params;
  }

  public async init() {
    const loaded = {
      all: 0,
      success: 0,
      failed: 0
    };

    print('TG CallbackButtons', 'The beginning of receiving information');

    const dir = __rootdir + '/src/telegram/buttons/callback/';
    const files = fs.readdirSync(dir)
      .filter(name => name.endsWith('.ts'));

    loaded.all = files.length;

    for(const file of files) {
      const name = file.split('.ts')[0];

      await import('file://' + dir + file)
        .then(() => {
          print('TG CallbackButtons', `Button ${ name } is loaded`);
          loaded.success++;
        })
        .catch(e => {
          print('TG CallbackButtons', `Button ${ name } loading error: ${ e }`);
          loaded.failed++;
        });
    }


    print('TG CallbackButtons', `Buttons received successfully [All: ${ loaded.all } | Success: ${ loaded.success } | Failed: ${ loaded.failed }]`);

  }

  public get list() {
    return this._list;
  }

  public getButton(text: string): [ string?, ITGCallbackButton? ] {
    text = text.toLowerCase();
    const button = this._list[text];

    if (button)
      return [ text, button ];

    for (const name in this._list) {
      const btn = this._list[name];
      if (!btn.alias)
        continue;

      if (btn.alias.includes(text))
        return [ name, btn ];
    }

    return [ undefined, undefined ];
  }
}

export const TGCallbackButtons = new Buttons();