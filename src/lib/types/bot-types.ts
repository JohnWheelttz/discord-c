export interface Indentify {
    op: number;
    d: {
      token: string;
      intents: number;
      properties: {
        $os: string;
        $browser: string;
        $device: string;
      }
    }
}

export interface PayloadBase {
    t: string;
    d: {
        heartbeat_interval?: number;
        content: string;
        author: {
        username: string;
        public_flags: string;
        id: string;
        discriminator: string;
        avatar: string
    }
    };
}

export type PayloadMessage = PayloadBase & {
  d: {
    channel_id: string;
    author: {
      bot: boolean;
    }
  }
};

export interface Commands {
  commandCall: (ctx: Ctx) => void;
  commandInd: string;
}

export interface Ctx {
    channel: {
      send: (...args: string[]) => void;
    }
    author: {
        mention: string;
        id: string;
        avatar: string;
        content: string;
    }
}
