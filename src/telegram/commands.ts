import { __rootdir, print } from '~/helpers';
import fs from 'fs';
import { CommandContext, ITGCommand } from '~/interfaces';

// Types
export type TTGCallbackCommand = (ctx: CommandContext) => Promise<void | CommandContext>;

// Interfaces
interface IList {
  [name: string]: ITGCommand
}

// Class
class Commands {
  static instance: null | Commands = null;
  private _list: IList = { };

  constructor() {
    if (!Commands.instance)
      Commands.instance = this;
    else
      return Commands.instance;
  }

  public register(name: string, params: ITGCommand) {
    this._list[name] = params;
  }

  public async init() {
    const loaded = {
      all: 0,
      success: 0,
      failed: 0
    };

    print('TG Commands', 'The beginning of receiving information');

    const dir = __rootdir + '/src/telegram/commands/';
    const files = fs.readdirSync(dir)
      .filter(name => name.endsWith('.ts'));

    loaded.all = files.length;

    for(const file of files) {
      const name = file.split('.ts')[0];

      await import('file://' + dir + file)
        .then(() => {
          print('TG Commands', `Command ${ name } is loaded`);
          loaded.success++;
        })
        .catch(e => {
          print('TG Commands', `Command ${ name } loading error: ${ e }`);
          loaded.failed++;
        });
    }


    print('TG Commands', `Commands received successfully [All: ${ loaded.all } | Success: ${ loaded.success } | Failed: ${ loaded.failed }]`);

  }

  public get list() {
    return this._list;
  }

  public getCommand(text: string): [ string?, ITGCommand? ] {
    text = text.toLowerCase();
    const command = this._list[text];

    if (command)
      return [ text, command ];

    for (const name in this._list) {
      const cmd = this._list[name];
      if (!cmd.alias)
        continue;

      if (cmd.alias.includes(text))
        return [ name, cmd ];
    }

    return [ undefined, undefined ];
  }
}

export const TGCommands = new Commands();