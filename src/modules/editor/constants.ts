import { VNodeTemplate } from './types/VNodeTemplate'
import merge from 'deepmerge'
import { DeepPartial } from 'utility-types'

/**
 * Sane defaults for instantiating nodes.
 */
export const defaultVNodeTemplate: VNodeTemplate = {
    material: {
        stroke: {
            active: '#76FF02',
            normal: '#3FC4FF'
        },
        fill: '#3C3C3C',
        opacity: 0.7
    },
    label: {
        text: 'Identity',
        size: 30,
        position: 'inside',
        fill: 'white'
    },
    shape: {
        borderRadius: 3,
        strokeWidth: 5,
        pinRadius: 10
    },
    pins: {
        inputs: 3,
        outputs: 2
    }
}

const topLeftPartial: DeepPartial<VNodeTemplate> = {
    label: {
        position: 'top-left',
        size: 15,
        fill: 'rgba(180,180,180,0.6)'
    }
}

const topCenterPartial: DeepPartial<VNodeTemplate> = {
    label: {
        position: 'top-center'
    }
}

export const topLeftTemplate = merge(defaultVNodeTemplate, topLeftPartial)
export const topCenterTemplate = merge(topLeftTemplate, topCenterPartial)
