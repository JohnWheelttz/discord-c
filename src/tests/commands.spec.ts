import { BotCommands, CommandsUse } from '../lib/modules/commands';
import { Commands } from '../lib/types/bot-types';

function createSutCommandsUse() {
    class CommandsUseMock extends CommandsUse {
        public modulesCommands: Commands[] = [];
    }

    return new CommandsUseMock();
}

function createSutBotCommands() {
    class botCommandsMock extends BotCommands {
        public commands: Commands[] = [];
    }

    return new botCommandsMock();
}

describe('CommandsUse',() => {
    afterEach(() => jest.clearAllMocks());    

    it('should command add command to this.commands', () => {
        const sut = createSutCommandsUse();

        expect(sut.modulesCommands.length).toBe(0);
        
        sut.command('algo', () => {});

        expect(sut.modulesCommands.length).toBe(1);
    });

    it('should command correct add commands', () => {
        const sut = createSutCommandsUse();   
        sut.command('algo', () => {});

        expect(sut.modulesCommands[0].commandInd).toBe('algo');
        expect(sut.modulesCommands[0].commandCall).toEqual(expect.any(Function));
    });
});

describe('BotCommands', () => {
    it('should commands have add', () => {
        const botCommandsMock = createSutCommandsUse();
        const sut = createSutBotCommands();
        
        botCommandsMock.command('oi', () => {});
        sut.commandsUse(botCommandsMock);

        expect(sut.commands.length).toBe(1);
    });

    it('should command correct add commands', () => {
        const botCommandsMock = createSutCommandsUse();
        const sut = createSutBotCommands();
        
        botCommandsMock.command('oi', () => {});
        sut.commandsUse(botCommandsMock);

        expect(sut.commands[0].commandInd).toBe('oi');
        expect(sut.commands[0].commandCall).toEqual(expect.any(Function));
    });
});

/* 
export class BotCommands extends BotBase {
    public static Commands = CommandsUse;

    commandsUse(bot: CommandsUse): void {
        bot.modulesCommands.forEach((com) => {
            this.commands.push(com);
        });
    }
}
*/