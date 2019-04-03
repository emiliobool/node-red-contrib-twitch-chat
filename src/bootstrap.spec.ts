export const helper = require('node-red-node-test-helper')
export const getNode = helper.getNode.bind(helper)

require('dotenv').config()
helper.init()

let _nodes = new Set()
let _flow: any = []
let _inputEvents = new Set()
let _credentials: any = {}

export function nodes(...nodes: any) {
    nodes.forEach((node: any) => _nodes.add(node))
}

export function flow(...flow: any) {
    _flow = flow
}
export function credentials(credentials: any) {
    _credentials = credentials
}

export function execute(fn: any) {
    helper.load([..._nodes], _flow, _credentials, fn)
}

export function describeFlow(title: string, fn: any) {
    describe(title, function() {
        before(function(done) {
            _flow = []
            _nodes.clear()
            helper.startServer(done)
        })
        after(function(done) {
            helper.unload()
            helper.stopServer(done)
        })
        afterEach(function() {
            // this could be chaned to loop through all _flow
            _inputEvents.forEach(nodeId =>
                getNode(nodeId).removeAllListeners('input')
            )
            _inputEvents.clear()
        })
        fn()
    })
}

export function nodeInput(node: string, fn: (msg: any) => void) {
    _inputEvents.add(node)
    getNode(node).on('input', fn)
}

export function outputNode(options = {}): any {
    return Object.assign(
        {
            id: 'output',
            type: 'helper',
        },
        options
    )
}

export const CHANNEL1 = process.env.TEST_CHANNEL1
export const USERNAME1 = process.env.TEST_USERNAME1
export const PASSWORD1 = process.env.TEST_PASSWORD1
