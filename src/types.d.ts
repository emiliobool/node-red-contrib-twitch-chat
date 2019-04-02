type ValidateFunction = (value: any) => boolean
interface PropertyDefinition {
    value: any
    required?: boolean
    validate?: ValidateFunction
    type?: string
}
interface EditableProperties {
    [key: string]: PropertyDefinition // reserved: type, x, y, z, wires, outputs
}
interface CredentialPropertyDefinition {
    type: 'text' | 'password'
}
interface CredentialProperties {
    [key: string]: CredentialPropertyDefinition
}
type Label = any
interface NodeDefinition {
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
