import BotBase from './contract/bot-base';;
import { Commands, Ctx } from '../types/bot-types';

export class CommandsUse {
    public modulesCommands: Commands[] = [];
    command(command: string, call: (ctx: Ctx) => void): void {
        const com = { 
            commandCall: call,
            commandInd: command
        };
        
        this.modulesCommands.push(com);
    }
}


export class BotCommands extends BotBase {
    public static Commands = CommandsUse;

    commandsUse(bot: CommandsUse): void {
        bot.modulesCommands.forEach((com) => {
            this.commands.push(com);
        });
    }
}

export default BotCommands;
