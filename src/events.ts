import { Red, Node } from 'node-red'
import { TmiClientNode } from './config';
import { events } from './events.definition';

module.exports = function(RED: Red) {
    function registerType(event: string, args: string[]) {
        RED.nodes.registerType(`tmi-event-${event}`, function(
            this: Node,
            config: any
        ): void {
            RED.nodes.createNode(this, config)
            const configNode = RED.nodes.getNode(config.config) as TmiClientNode
            const client = configNode.client as any
            const eventHandler = () => {
                const payload: any = {}
                for(let i in args){
                    payload[args[i]] = arguments[i]
                }
                this.send({ payload })
            }
            client.on(event, eventHandler)
            this.on("close", (done) => {
                client.off(event, eventHandler);
                done()
            })
            
        })
    }

    for (let event in events) {
        registerType(event, events[event])
    }
}
