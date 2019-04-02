import 'mocha'
import { expect } from 'chai'
import { Red } from 'node-red'
import { Client } from 'tmi.js'

import { ConfigNode, TmiClientNode, TmiClientConfig } from './config'
import {
    getNode,
    flow,
    execute,
    describeFlow,
    nodes,
    USERNAME1,
    PASSWORD1,
} from './bootstrap.spec'
import { ClientMockup } from './ClientMockup'

export function configNode(options: any = {}): any {
    return Object.assign(
        {
            id: 'config',
            type: 'tmi-config',
            name: 'name',
            username: USERNAME1,
            password: PASSWORD1,
            channels: '',
            log_info: false,
            log_warn: false,
            log_error: false,
        },
        options
    )
}

export function ConfigMockupNode(RED: Red) {
    RED.nodes.registerType('tmi-config', function(
        this: TmiClientNode,
        config: TmiClientConfig
    ) {
        RED.nodes.createNode(this, config)
        this.client = <any>new ClientMockup()
        this.client.connect()
        this.on('close', done => {
            this.client.removeAllListeners()
            if (!['CLOSED', 'CLOSING'].includes(this.client.readyState())) {
                this.client.disconnect().finally(done)
            }
        })
    })
}

describe('CONFIG', function(this: any) {
    // default node properties
    describeFlow('tmi-config', function() {
        it('should load and connect', function(done) {
            nodes(ConfigNode)
            flow(configNode())
            execute(function() {
                getNode('config').should.have.property('name', 'name')
                const client = getNode('config').client
                client.on('connected', function() {
                    expect(client.readyState()).to.equal('OPEN')
                    done()
                })
            })
        })
    })
    describeFlow('tmi-config(mockup)', function() {
        it('should load and connect', function(done) {
            nodes(ConfigMockupNode)
            flow(configNode())
            execute(function() {
                getNode('config').should.have.property('name', 'name')
                const client = getNode('config').client
                client.on('connected', function() {
                    expect(client.readyState()).to.equal('OPEN')
                    done()
                })
            })
        })
    })
})
