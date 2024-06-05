import { print } from "./helpers/index.js";
import { client, tg } from "./instances/index.js";
import { TGButtons } from "./telegram/buttons.js";
import { TGCallbackButtons } from "./telegram/callbackButtons.js";
import { TGCommands } from "./telegram/commands.js";
import { TGEvents } from "./telegram/events.js";

const start = async () => {
    await client.$connect()
        .then(() => print('database', 'Connection successfully'))
        .catch((e) => print('database', e))
    await tg.updates.startPolling({
        dropPendingUpdates: true
    }).then(() => print('Telegram', 'The bot has been successfully launched'))
        .catch((e) => print('Telegram', e))
    await TGEvents.init();
    await TGButtons.init();
    await TGCallbackButtons.init();
    await TGCommands.init();
}
start()
    .then(() => print('All Systems', 'Everything has been successfully launched'))
    .catch(async(e) => {
        await client.$disconnect();
        print('All Systems', e)
    });



