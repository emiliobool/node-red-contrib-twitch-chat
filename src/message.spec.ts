import 'mocha'
import { expect } from 'chai'

import {
    getNode,
    flow,
    execute,
    describeFlow,
    nodes,
    outputNode,
} from './bootstrap.spec'
import { ConfigMockupNode, configNode } from './config.spec'
import { MessageNode } from './message'

function messageNode(options: any = {}): any {
    return Object.assign(
        {
            id: 'message',
            type: 'tmi-event-message',
            name: 'name',
            config: 'config',
            channels: '',
            users: '',
            chat: true,
            whisper: false,
            subscriber: false,
            mod: false,
            broadcaster: false,
            regular: false,
            message: '',
            wires: [['output']],
        },
        options
    )
}
describe('MESSAGE', function(this: any) {
    describeFlow('tmi-event-message -> output', function() {
        it('should load', function(done) {
            nodes(ConfigMockupNode, MessageNode)
            flow(
                configNode(),
                messageNode(),
                outputNode()
            )
            execute(function() {
                getNode('message').should.have.property('name', 'name')
                done()
            })
        })
    })
})
