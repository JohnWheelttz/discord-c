import WebSocket from 'ws';

import { Indentify , Ctx, Commands } from '../../types/bot-types';

/* eslint-disable no-case-declarations*/
interface BotClass {
    start: (token: string, callback?:() => void) => void;
    onmessage: (callback: (ctx: Ctx) => void) => void;
    command: (command: string, call: (ctx: Ctx) => void) => void;
}

abstract class BotContract implements BotClass {
    protected abstract ws: WebSocket;
    protected abstract indentify: Indentify;
    protected abstract commands: Commands[];
    protected abstract messages: ((ctxPayload: Ctx) => void)[];
    
    abstract onmessage(callback: (ctx: Ctx) => void): void;
    abstract command(command: string, call: (ctx: Ctx) => void): void;
    abstract start(token: string, callback?: () => void): void;

}

export default BotContract;