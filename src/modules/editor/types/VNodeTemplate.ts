type LabelPosition = 'top-center' | 'top-left' | 'inside'

export interface VNodeTemplate {
    label: {
        text: string
        size: number
        fill: string
        position: LabelPosition
    }
    material: {
        stroke: {
            normal: string
            active: string
        }
        opacity: number
        fill: string
    }
    shape: {
        strokeWidth: number
        borderRadius: number
        pinRadius: number
    }
    pins: {
        inputs: number
        outputs: number
    }
}
