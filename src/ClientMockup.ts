import { EventEmitter } from 'events'
import { USERNAME1, CHANNEL1 } from './bootstrap.spec'

function sleep(time: number) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, time)
    })
}

export class ClientMockup extends EventEmitter /*implements Client*/ {
    _readyState: any = 'CLOSED'
    async connect(): Promise<[string, number]> {
        await sleep(30)
        this._readyState = 'OPEN'
        this.emit('connected')
        return ['127.0.0.1', 80]
    }
    async disconnect(): Promise<[string, number]> {
        await sleep(100)
        this._readyState = 'CLOSED'
        this.emit('disconnected')
        return ['127.0.0.1', 80]
    }
    readyState() {
        return this._readyState
    }

    mockMessage(
        message: string,
        channel: string = '',
        userstate: any = {},
        self: boolean = false
    ) {
        if (!channel) channel = CHANNEL1
        const newUserstate = Object.assign(
            {
                'badge-info': 'subscriber/25',
                badges: { subscriber: '24' },
                color: '#9ACD32',
                'display-name': USERNAME1,
                emotes: {},
                flags: null,
                id: 'd1a83c12-131f-4cd0-92ad-b3f8f5ff8bb0',
                mod: false,
                'room-id': '91265602',
                subscriber: true,
                'tmi-sent-ts': '1554250939536',
                turbo: false,
                'user-id': '138345386',
                'user-type': null,
                'emotes-raw': '',
                'badges-raw': 'vip/1,subscriber/24',
                username: USERNAME1,
                'message-type': 'chat',
            },
            userstate
        )
        this.emit('message', channel, newUserstate, message, self)
    }
}
