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
import { commands, CommandNodes } from './commands'

function commandNode(options: any = {}) {
    return Object.assign(
        {
            id: 'command',
            type: '',
            config: 'config',
            name: 'name',
            wires: [['output1', 'output2']],
        },
        options
    )
}
describe('COMMANDS', function(this: any) {
    // default node properties
    for (let command in commands) {
        const type = `tmi-command-${command}`
        describeFlow(type, function() {
            it('should load', function(done) {
                nodes(ConfigMockupNode, CommandNodes)
                flow(
                    configNode(),
                    commandNode({ type }),
                    outputNode({ id: 'output1' }),
                    outputNode({ id: 'output2' })
                )
                execute(function() {
                    getNode('command').should.have.property('name', 'name')
                    done()
                })
            })
        })
    }
})
