import { Red, Node } from 'node-red'
import { TmiClientNode } from './config'
import {
    connectedStatus,
    connectingStatus,
    disconnectedStatus,
} from './helpers'

export interface EventArgList {
    [action: string]: string[]
}
export const events: EventArgList = {
    action: ['channel', 'userstate', 'message', 'self'],
    anongiftpaidupgrade: ['channel', 'username', 'userstate'],
    ban: ['channel', 'username', 'reason', 'userstate'],
    chat: ['channel', 'username', 'reason', 'self'],
    cheer: ['channel', 'userstate', 'message'],
    clearchat: ['channel'],
    connected: ['address', 'port'],
    connecting: ['address', 'port'],
    disconnected: ['reason'],
    emoteonly: ['channel', 'enabled'],
    emotesets: ['sets', 'obj'],
    followersonly: ['channel', 'enabled', 'length'],
    giftpaidupgrade: ['channel', 'username', 'sender', 'userstate'],
    hosted: ['channel', 'username', 'viewers', 'autohost'],
    hosting: ['channel', 'target', 'viewers'],
    join: ['channel', 'username', 'self'],
    logon: [],
    // message: ['channel', 'userstate', 'message', 'self'],
    messagedeleted: ['channel', 'username', 'deleteMessage', 'userstate'],
    mod: ['channel', 'username'],
    mods: ['channel', 'mods'],
    notice: ['channel', 'msgid', 'message'],
    part: ['channel', 'username', 'self'],
    ping: [],
    pong: ['latency'],
    r9kbeta: ['channel', 'enabled'],
    raided: ['channel', 'username', 'viewers'],
    raw_message: ['messageCloned', 'message'],
    reconnect: [],
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
    vips: ['channel', 'vips'],
    whisper: ['from', 'userstate', 'message', 'self'],
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
            const readyState = client.readyState()
            this.status({})
            if (readyState === 'OPEN') this.status(connectedStatus)
            else if (readyState === 'CONNECTING') this.status(connectingStatus)
            else this.status(disconnectedStatus)
            client.on('connected', () => this.status(connectedStatus))
            client.on('connecting', () => this.status(connectingStatus))
            client.on('disconnected', () => this.status(disconnectedStatus))

            const eventHandler = (...eventArgs: any[]) => {
                const payload: any = {}
                for (let i in args) {
                    payload[args[i]] = eventArgs[i]
                }
                this.send({ payload })
            }
            client.on(event, eventHandler)
            this.on('close', done => {
                client.off(event, eventHandler)
                done()
            })
        })
    }

    for (let event in events) {
        registerType(event, events[event])
    }
}
