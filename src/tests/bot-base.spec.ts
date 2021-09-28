import BotBase from '../lib/modules/contract/bot-base'
import WebSocket from 'ws';
import axios from '../lib/settings/axios';

import message from './payload-message';

import { Commands, Ctx } from '../lib/types/bot-types';
import { AxiosStatic } from 'axios';

jest.mock('ws');
jest.mock('../lib/settings/axios');

jest.useFakeTimers();

const axiosMock = axios as jest.Mocked<AxiosStatic>;
declare namespace globalThis {
    const payload: string;
}
function createSut() {
    class BotBaseMock extends BotBase {
        public ws = new WebSocket('ws://com');
        public messages: ((ctxPayload: Ctx) => void)[] = [];
        public commands: Commands[] = [];
    }

    return new BotBaseMock();
}


describe('BotBase',() => {
    afterEach(() => jest.clearAllMocks());    

    it('should have start with open, message, close', () => {
        const sut = createSut();
        const wsSpy = jest.spyOn(sut.ws, 'on');
        sut.start('teste');

        expect(wsSpy).toBeCalledWith('open', expect.any(Function));
        expect(wsSpy).toBeCalledWith('message', expect.any(Function));
        expect(wsSpy).toBeCalledWith('close', expect.any(Function));
    });

    it('should starts with send payload', () => {
        const sut = createSut();
        const wsSpy = jest.spyOn(sut.ws, 'on');
        const wsSpySend = jest.spyOn(sut.ws, 'send');

        sut.ws.on = jest.fn().mockImplementation((type, call) => {
            if(type === 'open') call();
        });

        sut.start('test');

        expect(sut.ws.send).toBeCalled();
    });

    it('should call callback with callback', () => {
        const sut = createSut();
        const wsSpy = jest.spyOn(sut.ws, 'on');
        const spyCall = jest.fn();

        sut.ws.on = jest.fn().mockImplementation((type, call) => {
            if(type === 'open') call();
        });

        sut.start('test', spyCall);

        expect(spyCall).toBeCalled();
    });

    it('should no call timeInterval with no heart_beath', () => {
        const sut = createSut();
        const spy = jest.spyOn(sut, 'mainConnecting');

        sut.ws.on = jest.fn().mockImplementation((type, call) => {
            if(type === 'message') call(Buffer.from(JSON.stringify(message)));
        });

        sut.start('test');

        expect(spy).not.toBeCalled();
    });

    it('should call timeInterval with heart_beath', () => {
        const sut = createSut();
        const spy = jest.spyOn(sut, 'mainConnecting');

        const customMessage: any = { ...message };
        customMessage.d.heartbeat_interval = 10000;

        sut.ws.on = jest.fn().mockImplementation((type, call) => {
            if(type === 'message') call(Buffer.from(JSON.stringify(customMessage)));
        });

        sut.start('test');

        expect(spy).toBeCalled();
    });
    
    it('should if bot not call messages and commands', () => {
        const sut = createSut();
        const spyMessages = jest.fn();
        const spyCommands = jest.fn();

        const com = { 
            commandCall: spyCommands,
            commandInd: 'spy'
        };
        
        sut.commands.push(com);
        sut.messages.push(spyMessages);
        //const spyMessages = jest.spyOn(sut.messages, 'forEach');

        sut.ws.on = jest.fn().mockImplementation((type, call) => {
            if(type === 'message') call(Buffer.from(JSON.stringify(message)));
        });

        sut.start('test');

        expect(spyMessages).not.toBeCalled();
        expect(spyCommands).not.toBeCalled();
    });

    it('should start commands call if starts $ and not bot', () => {
        const sut = createSut();
        const spyCommands = jest.fn();

        const com = { 
            commandCall: spyCommands,
            commandInd: 'spy'
        };
        
        sut.commands.push(com);
        const customMessage = { ...message };
        customMessage.d.author.bot = false;

        sut.ws.on = jest.fn().mockImplementation((type, call) => {
            if(type === 'message') call(Buffer.from(JSON.stringify(message)));
        });

        sut.start('test');

        expect(spyCommands).toBeCalled();
    });

    it('should mainConnecting correct working', () => {
        expect.assertions(2);
        const sut = createSut();
        const connectingTimeoutSpy = jest.spyOn(global, 'setTimeout');
        const connectingSendSpy = jest.spyOn(sut.ws, 'send');

        sut.mainConnecting(2000);
        jest.advanceTimersByTime(1000);

        expect(connectingTimeoutSpy).toBeCalledWith(expect.any(Function), 1000);
        expect(connectingSendSpy).toBeCalledTimes(1);

        sut.ws.close();
    });

    it('should send correctly', () => {
        const sut = createSut();

        axiosMock.post.mockImplementation();

        sut.send(['oi', 'eae'], 'trooll');

        expect(axiosMock.post).toBeCalledWith('/channels/trooll/messages', {
            content: ' oi eae'
        }, expect.any(Object));
    });

    it('should command add command to this.commands', () => {
        const sut = createSut();

        expect(sut.commands.length).toBe(0);
        
        sut.command('algo', () => {});

        expect(sut.commands.length).toBe(1);
    });

    it('should command correct add commands', () => {
        const sut = createSut();   
        sut.command('algo', () => {});

        expect(sut.commands[0].commandInd).toBe('algo');
        expect(sut.commands[0].commandCall).toEqual(expect.any(Function));
    });

    it('should guard callback onmessage', () => {
        const sut = createSut();   
    
        expect(sut.messages.length).toBe(0);
        sut.onmessage(() => {});
        expect(sut.messages.length).toBe(1);
    });

    it('should call any messages if MESSAGE_CREATE', () => {
        const sut = createSut();   
        const spy = jest.fn();
        sut.onmessage(spy);
        expect(sut.messages[0]).toEqual(expect.any(Function));

        sut.messages[0]('ctx' as any);

        expect(spy).toBeCalledWith('ctx');
    });

    it('should on close reconnectings', () => {
        const sut = createSut();
        const spy = jest.spyOn(sut, 'start');
        
        let rateLimit = 0;

        sut.ws.on = jest.fn().mockImplementation((type, call) => {
            if(type === 'close' && rateLimit === 0) {
                rateLimit++;
                call();
            }
        });;

        sut.start('token');

        expect(spy).toBeCalledWith('token');
        
    });
});
