import { VNodeListCell } from '../classes/VNodeList'

export type PinTemplate = {
    label: string
}

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
        generate: (v: VNodeListCell) => unknown
        scale: [number, number]
        margin: number
    }
    pins: {
        inputs: PinTemplate[]
        outputs: PinTemplate[]
    }
}
