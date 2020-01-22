import { JSX } from 'preact'
import { VNodeState } from './VNodeState'

export type PinTemplate = {
    label: string
}

/**
 * Template for visual aspects of the node.
 */
export interface NodeMaterial {
    stroke: {
        normal: string
        active: string
    }
    opacity: number
    fill: string
    pinLabelFIll: string
}

/**
 * Template for different built in nodes.
 */
export interface VNodeTemplate {
    label: {
        text: string
        size: number
        fill: string
        description: string
    }
    material: NodeMaterial
    shape: {
        strokeWidth: number
        borderRadius: number
        pinRadius: number
    }
    content: {
        generate: (v: VNodeState) => JSX.Element
        scale: [number, number]
        margin: number
    }
    pins: {
        inputs: PinTemplate[]
        outputs: PinTemplate[]
    }
}
