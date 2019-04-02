/// <reference path="types.d.ts" />
import { NodeStatus } from "node-red";

const path = require('path')
export const nunjucks = require('nunjucks')
nunjucks.configure(path.resolve(__dirname, 'templates'), { autoescape: true })

export const connectedStatus: NodeStatus = {
    fill: 'green',
    shape: 'dot',
    text: 'connected',
}
export const connectingStatus: NodeStatus = {
    fill: 'green',
    shape: 'ring',
    text: 'connecting...',
}
export const disconnectedStatus: NodeStatus = {
    fill: 'red',
    shape: 'ring',
    text: 'disconnected',
}

export function stringifyFunctions(data: any) {
    const replacements: any = {}
    let stringified = JSON.stringify(
        data,
        (key, value) => {
            if (typeof value === 'function') {
                const uniqueKey =
                    '_' +
                    Math.random()
                        .toString(36)
                        .substr(2, 9)
                replacements[uniqueKey] = value.toString()
                return uniqueKey
            } else {
                return value
            }
        },
        4
    )
    for (let key in replacements) {
        stringified = stringified.replace(`"${key}"`, replacements[key])
    }
    return stringified
}
export function getRegisterTypeTag(
    type: string,
    definition: NodeDefinition
): string {
    const definitionString = stringifyFunctions(definition)
    return wrapNode(`
let definition = ${definitionString}
RED.nodes.registerType('${type}', definition)
`)
}

export function wrapNode(contents: string): string {
    return `<script type="text/javascript">(function(){${contents}}())</script>`
}
export function wrapTemplate(type: string, contents: string): string {
    return `<script type="text/html" data-template-name="${type}">${contents}</script>`
}
export function wrapHelp(type: string, contents: string): string {
    return `<script type="text/html" data-help-name="${type}">${contents}</script>`
}
