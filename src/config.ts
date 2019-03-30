import { Red, Node, NodeProperties } from "node-red";
import tmi from "tmi.js";

export interface TmiClientConfig extends NodeProperties {
    name: string
    username: string
    password: string
    channels: string
}
export interface TmiClientNode extends Node {
    client: tmi.Client
}

module.exports = function (RED: Red) {
    function TmiClient(this: TmiClientNode, config: TmiClientConfig) {
        RED.nodes.createNode(this, config);
        const channels = config.channels.split(',').map(channel => channel.trim())
        const options: tmi.Options = {
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: config.username,
                password: config.password
            },
            channels,
            logger: {
                info: this.log.bind(this),
                warn: this.warn.bind(this),
                error: this.error.bind(this)
            }
        }

        this.client = new (tmi.client as any)(options)
        this.client.connect()

        this.on("close", (done) => {
            this.client.removeAllListeners()
            this.client.disconnect().finally(done)
        })
    }
    RED.nodes.registerType("tmi-config", TmiClient);
};
