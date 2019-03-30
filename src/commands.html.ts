import { commands } from "./commands";

type ValidateFunction = (value: any) => boolean
interface PropertyDefinition{
    value: any
    required?: boolean
    validate?: ValidateFunction
    type?: string
}
interface EditableProperties{
    [key: string]: PropertyDefinition // reserved: type, x, y, z, wires, outputs
}
interface CredentialPropertyDefinition{
    type: 'text' | 'password'
}
interface CredentialProperties{
    [key: string]: CredentialPropertyDefinition
}
type Label = any
interface NodeDefinition{
    category: string
    defaults: EditableProperties
    credentials?: CredentialProperties
    inputs: number
    outputs: number
    color: string
    paletteLabel: Label
    label: Label
    labelStyle?: Label
    inputLabels?: Label
    outputLabels?: Label
    icon?: string
    align?: string
    oneditprepare?: () => void
    oneditsave?: () => void
    oneditcancel?: () => void
    oneditdelete?: () => void
    oneditresize?: () => void
    onpaletteadd?: () => void
    onpaletteremove?: () => void
}

let contents = ''

for(let command in commands){
    const paletteLabel = command.charAt(0).toUpperCase() + command.slice(1)
    createNode(`tmi-command-${command}`, {
        category: "Streaming Tools",
            color: "#6441a5",
            defaults: {
                config: {
                    type: "tmi-config",
                    value: "",
                },
                name: {
                    value: ""
                }
            },
            icon: "twitch-icon.png",
            inputs: 1,
            outputs: 1,
            labelStyle: "tmi_node_label",
            paletteLabel,
            label: function() {
                // @ts-ignore
                return this.name
            }
    })
}

function createNode(type: string, definition: NodeDefinition){
    const definitionString = JSON.stringify(definition)
    return `RED.nodes.registerType('${type}', ${definitionString})`
}

function createTemplate(){
    return `
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
`
}

function createHelp(){
    return '<p>Command node</p>'
}

