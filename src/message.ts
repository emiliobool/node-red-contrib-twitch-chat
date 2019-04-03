import { Red, Node, NodeProperties } from 'node-red'
import { TmiClientNode, statusUpdater } from './config'
import { ChatUserstate } from 'tmi.js'

export interface TmiMessageConfig extends NodeProperties {
    name: string
    config: string
    channels: string
    users: string

    // message type
    action: boolean
    chat: boolean
    whisper: boolean

    // user type
    subscriber: boolean
    mod: boolean
    broadcaster: boolean
    regular: boolean

    message: string
}

export function MessageNode(RED: Red) {
    RED.nodes.registerType(`tmi-event-message`, function(
        this: Node,
        config: TmiMessageConfig
    ): void {
        const time = new Date().getTime()
        console.log('loaded', time)
        RED.nodes.createNode(this, config)
        if (!config.config) return
        const configNode = RED.nodes.getNode(config.config) as TmiClientNode
        if (!configNode) return
        const client = configNode.client as any

        // connection status
        const clearStatusHandlers = statusUpdater(this, client)

        const channels = config.channels
            .split(',')
            .map(channel => channel.trim().replace(/^#/, ''))
            .filter(Boolean)
        const users = config.users
            .split(',')
            .map(user => user.trim().toLowerCase())
            .filter(Boolean)
        const ignoreMessageType =
            !config.action && !config.chat && !config.whisper
        const messageTypes: string[] = []
        if (config.action) messageTypes.push('action')
        if (config.whisper) messageTypes.push('whisper')
        if (config.chat) messageTypes.push('chat')

        const subscriber = config.subscriber
        const mod = config.mod
        const broadcaster = config.broadcaster
        const regular = config.regular

        const ignoreUserType =
            (subscriber && broadcaster && regular && mod) ||
            (!subscriber && !broadcaster && !regular && !mod)
        const messageRegExp = new RegExp(config.message)

        function checkMessageType(userstate: ChatUserstate): boolean {
            return (
                ignoreMessageType ||
                (userstate['message-type'] !== undefined &&
                    messageTypes.includes(userstate['message-type']))
            )
        }

        function checkUserType(userstate: ChatUserstate) {
            return (
                ignoreUserType ||
                (mod && userstate.mod) ||
                (userstate.badges !== undefined &&
                    ((subscriber && userstate.badges.subscriber) ||
                        (broadcaster && userstate.badges.broadcaster) ||
                        (regular &&
                            !userstate.mod &&
                            !userstate.badges.subscriber &&
                            !userstate.badges.broadcaster)))
            )
        }

        function checkMessage(message: string) {
            return messageRegExp.exec(message)
        }

        function checkChannel(channel: string) {
            return (
                channels.length <= 0 ||
                channels.includes(channel.replace(/^#/, ''))
            )
        }

        function checkUser(userstate: ChatUserstate) {
            return (
                users.length <= 0 ||
                (userstate.username !== undefined &&
                    users.includes(userstate.username))
            )
        }

        const eventHandler = (
            channel: string,
            userstate: ChatUserstate,
            message: string,
            self: boolean
        ) => {
            if (
                checkChannel(channel) &&
                checkUser(userstate) &&
                checkMessageType(userstate) &&
                checkUserType(userstate)
            ) {
                console.log('eventHandlerCalled', time)
                const matches = checkMessage(message)
                if (matches) {
                    this.send({
                        payload: {
                            channel,
                            userstate,
                            message,
                            self,
                            matches,
                        },
                    })
                }
            }
        }

        client.on('message', eventHandler)

        this.on('close', done => {
            client.removeListener('message', eventHandler)
            clearStatusHandlers()
            done()
        })
    })
}
