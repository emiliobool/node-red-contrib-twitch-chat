import { Red, Node } from 'node-red'
import { TmiClientNode } from './config'
import { commands } from './commands.definition'

export = function(RED: Red) {
    function registerType(command: string, args: string[]) {
        RED.nodes.registerType(`tmi-command-${command}`, function(
            this: Node,
            config: any
        ): void {
            RED.nodes.createNode(this, config)
            const configNode = RED.nodes.getNode(config.config) as TmiClientNode
            const client = configNode.client

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
                        this.send(msgCopy)
                    })
                    .catch(this.error)
            })
        })
    }

    for (let command in commands) {
        registerType(command, commands[command])
    }
}
