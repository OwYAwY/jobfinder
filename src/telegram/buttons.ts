import { __rootdir, print } from '~/helpers';
import fs from 'fs';
import { CommandContext, ITGButton } from '~/interfaces';

// Types
export type TTGCallbackCommand = (ctx: CommandContext) => Promise<void | CommandContext>;

// Interfaces
interface IList {
  [name: string]: ITGButton
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

  public register(name: string, params: ITGButton) {
    this._list[name] = params;
  }

  public async init() {
    const loaded = {
      all: 0,
      success: 0,
      failed: 0
    };

    print('TG Buttons', 'The beginning of receiving information');

    const dir = __rootdir + '/src/telegram/buttons/classic/';
    const files = fs.readdirSync(dir)
      .filter(name => name.endsWith('.ts'));

    loaded.all = files.length;

    for(const file of files) {
      const name = file.split('.ts')[0];

      await import('file://' + dir + file)
        .then(() => {
          print('TG Buttons', `Button ${ name } is loaded`);
          loaded.success++;
        })
        .catch(e => {
          print('TG Buttons', `Command ${ name } loading error: ${ e }`);
          loaded.failed++;
        });
    }


    print('TG Buttons', `Buttons received successfully [All: ${ loaded.all } | Success: ${ loaded.success } | Failed: ${ loaded.failed }]`);

  }

  public get list() {
    return this._list;
  }

  public getButton(text: string): [ string?, ITGButton? ] {
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

export const TGButtons = new Buttons();