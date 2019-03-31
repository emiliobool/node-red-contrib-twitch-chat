/// <reference path="types.d.ts" />
import { events } from './events.definition'
import { getRegisterTypeTag, wrapTemplate, wrapHelp } from './helpers';


export let contents = ''

for (let event in events) {
    const paletteLabel = event.charAt(0).toUpperCase() + event.slice(1)
    contents += getRegisterTypeTag(`tmi-event-${event}`, {
        category: 'Streaming Tools',
        color: '#6441a5',
        defaults: {
            config: {
                type: 'tmi-config',
                value: '',
            },
            name: {
                value: '',
            },
        },
        align: 'left',
        icon: 'twitch-arrow.png',
        inputs: 0,
        outputs: 1,
        labelStyle: 'tmi_node_label',
        paletteLabel,
        label: function() {
            // @ts-ignore
            return this.name
        },
    })
    contents += wrapTemplate(`tmi-event-${event}`, `
    <div class="tmi-template">
        <div class="form-row">
            <label for="node-input-client"><i class="icon-tag"></i> Config</label>
            <input type="text" id="node-input-client">
        </div>
        <div class="form-row">
            <label for="node-input-name"><i class="icon-tag"></i> Name</label>
            <input type="text" id="node-input-name">
        </div>
    </div>
`)
    contents += wrapHelp(`tmi-event-${event}`, `<p>${event} node</p>`)
}
