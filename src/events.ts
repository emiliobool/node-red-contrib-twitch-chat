import { Red, Node } from 'node-red'
import { TmiClientNode, statusUpdater } from './config'
export interface EventArgList {
    [action: string]: string[]
}
export const events: EventArgList = {
    action: ['channel', 'userstate', 'message', 'self'],
    anongiftpaidupgrade: ['channel', 'username', 'userstate'],
    anonsubgift: ['channel', 'streakMonths', 'recipient', 'methods', 'userstate'],
    anonsubmysterygift: ['channel', 'giftSubCount', 'methods', 'userstate'],
    announcement: ['channel', 'userstate', 'message', '_', 'color'],
    ban: ['channel', 'username', 'reason', 'userstate'],
    chat: ['channel', 'username', 'reason', 'self'],
    cheer: ['channel', 'userstate', 'message'],
    clearchat: ['channel'],
    connected: ['address', 'port'],
    connecting: ['address', 'port'],
    disconnected: ['reason'],
    emoteonly: ['channel', 'enabled'],
    emotesets: ['sets', 'obj'],
    followersonly: ['channel', 'enabled', 'minutes'],
    giftpaidupgrade: ['channel', 'username', 'sender', 'userstate'],
    globaluserstate: ['userstate'],
    hosted: ['channel', 'username', 'viewers', 'autohost'],
    hosting: ['channel', 'target', 'viewers'],
    join: ['channel', 'username', 'self'],
    logon: [],
    // message: ['channel', 'userstate', 'message', 'self'],
    maxreconnect: [],
    messagedeleted: ['channel', 'username', 'deleteMessage', 'userstate'],
    mod: ['channel', 'username'],
    mods: ['channel', 'mods'],
    notice: ['channel', 'msgID', 'message'],
    part: ['channel', 'username', 'self'],
    ping: [],
    pong: ['latency'],
    r9kbeta: ['channel', 'enabled'],
    raided: ['channel', 'username', 'viewers', 'userstate'],
    raw_message: ['messageCloned', 'message'],
    reconnect: [],
    redeem: ['channel', 'username', 'rewardType', 'userstate', 'message'],
    resub: [
        'channel',
        'username',
        'streakMonths',
        'message',
        'userstate',
        'methods',
    ],
    roomstate: ['channel', 'state'],
    serverchange: ['channel'],
    slowmode: ['channel', 'enabled', 'length'],
    subgift: [
        'channel',
        'username',
        'streakMonths',
        'recipient',
        'methods',
        'userstate',
    ],
    submysterygift: [
        'channel',
        'username',
        'numbOfSubs',
        'methods',
        'userstate',
    ],
    subscribers: ['channel', 'enabled'],
    subscription: ['channel', 'username', 'methods', 'message', 'userstate'],
    timeout: ['channel', 'username', 'reason', 'duration', 'userstate'],
    unhost: ['channel', 'viewers'],
    unmod: ['channel', 'username'],
    usernotice: ['msgID', 'channel', 'userstate', 'message'],
    vips: ['channel', 'vips'],
    whisper: ['from', 'userstate', 'message', 'self'],
    primepaidupgrade: ['channel', 'username', 'methods', 'userstate'],
    automod: ['channel', 'msgID', 'message'],
}

export function EventNodes(RED: Red) {
    function registerType(event: string, args: string[]) {
        RED.nodes.registerType(`tmi-event-${event}`, function(
            this: Node,
            config: any
        ): void {
            RED.nodes.createNode(this, config)
            if (!config.config) return
            const configNode = RED.nodes.getNode(config.config) as TmiClientNode
            if (!configNode) return
            const client = configNode.client as any

            // connection status
            const clearStatusHandlers = statusUpdater(this, client)

            const eventHandler = (...eventArgs: any[]) => {
                const payload: any = {}
                for (let i in args) {
                    payload[args[i]] = eventArgs[i]
                }
                this.send({ payload })
            }
            client.on(event, eventHandler)
            this.on('close', (done: () => void) => {
                client.removeListener(event, eventHandler)
                clearStatusHandlers()
                done()
            })
        })
    }

    for (let event in events) {
        registerType(event, events[event])
    }
}
