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
            action: false,
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
        it('should filter messages by channel')
        it('should filter messages by username')
        it('should filter messages by message type chat')
        it('should filter messages by message type whisper')
        it('should filter messages by message type action')
        it('should filter messages by user type subscriber')
        it('should filter messages by user type mod')
        it('should filter messages by user type broadcaster')
        it('should filter messages by user type regular')
        it('should filter messages by message')
    })
})
