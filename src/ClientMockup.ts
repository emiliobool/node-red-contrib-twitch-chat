import { EventEmitter } from 'events'

function sleep(time: number) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, time)
    })
}

export class ClientMockup extends EventEmitter /*implements Client*/ {
    _readyState: any = 'CLOSED'
    async connect(): Promise<[string, number]> {
        await sleep(100)
        this._readyState = 'OPEN'
        this.emit('connected')
        return ['', 0]
    }
    async disconnect(): Promise<[string, number]> {
        await sleep(100)
        this._readyState = 'CLOSED'
        this.emit('disconnected')
        return ['', 0]
    }
    readyState() {
        return this._readyState
    }

    mockMessage(
        channel: string,
        userstate: any,
        message: string,
        self: boolean
    ) {
        this.emit('message', channel, userstate, message, self)
    }
}
