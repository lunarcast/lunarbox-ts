import { JSX } from 'preact'
import { VNodeState } from './VNodeState'

export type PinTemplate = {
    label: string
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
    material: {
        stroke: {
            normal: string
            active: string
        }
        opacity: number
        fill: string
        pinLabelFIll: string
    }
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
