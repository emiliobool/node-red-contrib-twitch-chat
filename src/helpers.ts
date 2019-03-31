export function stringifyFunctions(data: any) {
    const replacements: any = {}
    let stringified = JSON.stringify(data, (key, value) => {
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
    })
    for (let key in replacements) {
        stringified = stringified.replace(`"${key}"`, replacements[key])
    }
    return stringified
}
export function getRegisterTypeTag(type: string, definition: NodeDefinition): string {
    const definitionString = stringifyFunctions(definition)
    return wrapNode(`RED.nodes.registerType('${type}', ${definitionString})`)
}


export function wrapNode(contents: string): string{
    return `<script type="text/javascript">${contents}</script>`
}
export function wrapTemplate(type: string, contents: string): string{
    return `<script type="text/html" data-template-name="${type}">${contents}</script>`
}
export function wrapHelp(type: string, contents: string): string {
    return `<script type="text/html" data-help-name="${type}">${contents}</script>`
}
