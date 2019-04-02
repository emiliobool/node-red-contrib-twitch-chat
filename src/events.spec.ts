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
import { EventNodes, events } from './events'

function eventNode(options: any = {}) {
    return Object.assign(
        {
            id: 'event',
            type: '',
            config: 'config',
            name: 'name',
            wires: [['output']],
        },
        options
    )
}
describe('EVENTS', function(this: any) {
    // default node properties
    for (let event in events) {
        const type = `tmi-event-${event}`
        describeFlow(`${type} -> output`, function() {
            it('should load', function(done) {
                nodes(ConfigMockupNode, EventNodes)
                flow(
                    configNode(),
                    eventNode({ type }),
                    outputNode()
                )
                execute(function() {
                    getNode('event').should.have.property('name', 'name')
                    done()
                })
            })
        })
    }
})
