import { Red, Node, NodeProperties } from 'node-red'
import tmi from 'tmi.js'

export interface TmiClientConfig extends NodeProperties {
    name: string
    username: string
    password: string
    channels: string
    reconnect: boolean
    secure: boolean
    log_info: boolean
    log_warn: boolean
    log_error: boolean
}
export interface TmiClientNode extends Node {
    client: tmi.Client
}

export function ConfigNode(RED: Red) {
    function TmiClient(this: TmiClientNode, config: TmiClientConfig) {
        RED.nodes.createNode(this, config)
        const channels = config.channels
            .split(',')
            .map(channel => channel.trim())
            .filter(Boolean)

        const logger: any = {}
        if (config.log_info) logger.info = this.log.bind(this)
        else logger.info = () => {}
        if (config.log_warn) logger.warn = this.warn.bind(this)
        else logger.warn = () => {}
        if (config.log_error) logger.error = this.error.bind(this)
        else logger.error = () => {}

        if (config.reconnect === undefined) config.reconnect = true
        if (config.secure === undefined) config.secure = true

        const options: tmi.Options = {
            connection: {
                reconnect: config.reconnect,
                secure: config.secure,
            },
            channels,
            logger,
        }
        if (config.username || config.password) {
            options.identity = {}
            if (config.username) options.identity.username = config.username
            if (config.password) options.identity.password = config.password
        }

        this.client = new (tmi.client as any)(options)
        this.client.connect()

        this.on('close', done => {
            this.client.removeAllListeners()
            if (!['CLOSED', 'CLOSING'].includes(this.client.readyState())) {
                this.client.disconnect().finally(done)
            }
        })
    }
    RED.nodes.registerType('tmi-config', TmiClient)
}
