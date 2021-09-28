import WebSocket from 'ws';
import axios from '../../settings/axios';

import BotContract from './bot';
import { Ctx, Commands, PayloadBase, PayloadMessage } from '../../types/bot-types';
import { AxiosError } from 'axios';

/* eslint-disable no-case-declarations*/
abstract class BotBase extends BotContract {
    protected ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
    
    protected indentify = {
        op: 2,
        d: {
          token: "NDgwNDAzMTM4MTkzNjUzNzYx.W3hASQ.ic-759y06dLIcciFAgSWhgEKvUs",
          intents: 513,
          properties: {
            $os: "linux",
            $browser: "chrome",
            $device: "my_library"
          }
        }
      };
    
    protected commands: Commands[] = [];
    protected messages: ((ctxPayload: Ctx) => void)[] = [];
    
    onmessage(callback: (ctx: Ctx) => void): void {
        const callGuard = (ctxPayload: Ctx) => {
                callback(ctxPayload);
            };

            this.messages.push(callGuard);
        }

    async send(contents: string[], channel: string): Promise<void> {
        let contentFull = '';

        contents.forEach((content) => {
            contentFull += ` ${content}`
        });

        try {
            const response = await axios.post(`/channels/${channel}/messages`, {
                content: contentFull
            }, {
                headers: {
                    authorization: `Bot ${this.indentify.d.token}`
                }
            });
        } catch(e) {
            interface Error {
                response: {
                    data: Record<string, unknown>;
                }
            }
            const error = e as Error;
        }
    }
    
    command(command: string, call: (ctx: Ctx) => void): void {
        const com = { 
            commandCall: call,
            commandInd: command
        };
        
        this.commands.push(com);
    }
    
    async mainConnecting(timeInterval: number) {
        setTimeout(() => {
            this.ws.send(JSON.stringify({
                op: 1,
                d: 251
            }, null, 2));

            this.mainConnecting(timeInterval);
            
            return;
        }, timeInterval - 1000);
    }

    start(token: string, callback?: () => void): void {
        this.indentify.d.token = token;
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify(this.indentify));
            callback && callback();
        });

        this.ws.on('message', (data) => {
            const dataString = data.toString();
            const payload: PayloadBase = JSON.parse(dataString);
            const timeInterval = payload.d && payload.d.heartbeat_interval;
            const message = payload.d && payload.d.content as string;
            if(timeInterval) this.mainConnecting(timeInterval);
            
            switch(payload.t) {
                case 'MESSAGE_CREATE':
                    const payloadMessage = payload as PayloadMessage;

                    if(payloadMessage.d.author.bot) return;
                    
                    const ctx: Ctx = {
                            channel: {
                                send: (...args: string[]) => {
                                    this.send(args, payloadMessage.d.channel_id);
                                }
                            },
                            author: {
                                mention: `<@!${payload.d.author.id}>`,
                                id: payload.d.author.id,
                                avatar: payload.d.author.avatar,
                                content: payload.d.content
                            }
                    };

                    this.messages.forEach((call) => {
                        call(ctx);
                    });
                    switch(message[0]) {
                        case '$':
                            this.commands.forEach((commands) => {
                                if(message.slice(1) === commands.commandInd) {
                                    commands.commandCall(ctx);
                                }
                            });
                    }
                    return;
                default:
                    return;
            }
        });

        this.ws.on('close', () => {
            this.start(this.indentify.d.token);
        });
    }
}

export default BotBase;