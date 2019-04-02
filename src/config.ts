import { Red, Node, NodeProperties } from 'node-red'
import tmi from 'tmi.js'

export interface TmiClientConfig extends NodeProperties {
    name: string
    username: string
    password: string
    channels: string
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

        const options: tmi.Options = {
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username: config.username,
                password: config.password,
            },
            channels,
            logger,
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
