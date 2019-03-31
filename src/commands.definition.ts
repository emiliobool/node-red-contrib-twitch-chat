interface CommandArgList {
    [action: string]: string[]
}

export const commands: CommandArgList = {
    action: ['channel', 'message'],
    ban: ['channel', 'username', 'reason'],
    clear: ['channel'],
    color: ['color'],
    commercial: ['channel', 'seconds'],
    connect: [],
    deletemessage: ['channel', 'messageUUID'],
    disconnect: [],
    emoteonly: ['channel'],
    emoteonlyoff: ['channel'],
    followersonly: ['channel', 'length'], //string, int
    followersonlyoff: ['channel'],
    host: ['channel', 'target'], //
    join: ['channel'],
    mod: ['channel', 'username'],
    mods: ['channel'],
    part: ['channel'],
    ping: [],
    r9kbeta: ['channel'],
    r9kbetaoff: ['channel'],
    raw: ['message'],
    say: ['channel', 'message'],
    slow: ['channel', 'length'],
    slowoff: ['channel'],
    subscribers: ['channel'],
    subscribersoff: ['channel'],
    timeout: ['channel', 'username', 'length', 'reason'], // [length: int], [reason: string]
    unban: ['channel', 'username'],
    unhost: ['channel'],
    unmod: ['channel', 'username'],
    unvip: ['channel', 'username'],
    vip: ['channel', 'username'],
    vips: ['channel'],
    whisper: ['username', 'message'],
}
