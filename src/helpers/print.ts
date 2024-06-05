type TTgTag = 
| 'Telegram' 
| 'Telegram Events' 
| 'Telegram Commands' 
| 'Telegram Buttons';
type TOther = 'Database';
type TTag = TOther

export const print = (tag: string | TTag, ...args: unknown[]) => {
    console.log(`\u001b[38;5;14m[${ new Date().toISOString() }]`, `\u001b[33m[${ tag || 'Unknown' }]:\u001b[0m`, ...args);
    return print;
};
  