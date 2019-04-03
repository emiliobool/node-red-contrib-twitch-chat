import { Red, Node } from 'node-red'
import { TmiClientNode } from './config'
import {
    connectedStatus,
    connectingStatus,
    disconnectedStatus,
} from './helpers'

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

export function CommandNodes(RED: Red) {
    function registerType(command: string, args: string[]) {
        RED.nodes.registerType(`tmi-command-${command}`, function(
            this: Node,
            config: any
        ): void {
            RED.nodes.createNode(this, config)
            if (!config.config) return
            const configNode = RED.nodes.getNode(config.config) as TmiClientNode
            if (!configNode) return
            const client = configNode.client

            // connection status
            const readyState = client.readyState()
            this.status({})
            if (readyState === 'OPEN') this.status(connectedStatus)
            else if (readyState === 'CONNECTING') this.status(connectingStatus)
            else this.status(disconnectedStatus)
            client.on('connected', () => this.status(connectedStatus))
            client.on('connecting', () => this.status(connectingStatus))
            client.on('disconnected', () => this.status(disconnectedStatus))

            // input
            this.on('input', (msg: any) => {
                const msgCopy = Object.assign({}, msg)

                const commandArgs = []
                for (let i in args) {
                    const arg = args[i]
                    commandArgs.push(msg.payload[arg] || config[arg])
                }
                const returnValue = (client as any)[command].apply(
                    client,
                    commandArgs
                )

                Promise.resolve(returnValue)
                    .then(data => {
                        const payload: any = {}
                        for (let i in args) {
                            payload[args[i]] = data[i]
                        }
                        msgCopy.payload = payload
                        this.send([msgCopy, null])
                    })
                    .catch(error => {
                        this.send([null, error])
                    })
            })
        })
    }

    for (let command in commands) {
        registerType(command, commands[command])
    }
}
