const path = require('path')
import { commands } from './commands'
import { events } from './events'

const nunjucks = require('nunjucks')
nunjucks.configure(path.resolve(__dirname, 'templates'), { autoescape: true })

export let contents = ''

for (let command in commands) {
    const title = command.charAt(0).toUpperCase() + command.slice(1)
    contents += nunjucks.render('commands.html', {
        command,
        title,
        arguments: commands[command],
    })
}

for (let event in events) {
    const title = event.charAt(0).toUpperCase() + event.slice(1)
    contents += nunjucks.render('events.html', {
        event,
        title,
        arguments: events[event],
    })
}
