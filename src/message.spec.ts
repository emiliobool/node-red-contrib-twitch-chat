import 'mocha'
import { expect } from 'chai'

import {
    getNode,
    flow,
    execute,
    describeFlow,
    nodes,
    outputNode,
    nodeInput,
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
            user_list: '',
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
        it('should filter by channel')
        it('should filter by username')
        it('should filter by message type chat')
        it('should filter by message type whisper')
        it('should filter by message type action')
        it('should filter by user type subscriber')
        it('should filter by user type mod')
        it('should filter by user type broadcaster')
        it('should filter by user type regular')
    })
    describeFlow('tmi-event-message(message,test) -> output', function() {
        it('should match', function(done) {
            nodes(ConfigMockupNode, MessageNode)
            flow(
                configNode(),
                messageNode({ message: 'test' }),
                outputNode()
            )
            execute(function() {
                const message = 'emilio test'
                const client = getNode('config').client
                nodeInput('output', msg => {
                    msg.payload.message.should.equal(message)
                    done()
                })
                client.mockMessage(message)
            })
        })
        it('should not match', function(done) {
            const message = 'other message'
            const client = getNode('config').client
            nodeInput('output', msg => {
                done(new Error('Message should be filtered out'))
            })
            client.mockMessage(message)
            setTimeout(done, 10)
        })
    })
    describeFlow('tmi-event-message(whole word) -> output', function() {
        it('should match', function(done) {
            nodes(ConfigMockupNode, MessageNode)
            flow(
                configNode(),
                messageNode({ message: '\\btest\\b' }),
                outputNode()
            )
            execute(function() {
                const message = 'emilio test should match'
                const client = getNode('config').client
                nodeInput('output', msg => {
                    msg.payload.message.should.equal(message)
                    done()
                })
                client.mockMessage(message)
            })
        })
        it('should match', function(done) {
            const message = 'other test'
            const client = getNode('config').client
            nodeInput('output', msg => {
                msg.payload.message.should.equal(message)
                done()
            })
            client.mockMessage(message)
        })
        it('should not match', function(done) {
            const message = 'other testmessage'
            const client = getNode('config').client
            nodeInput('output', msg => {
                done(new Error('Message should not match'))
            })
            client.mockMessage(message)
            setTimeout(done, 10)
        })
    })
})
