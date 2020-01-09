import { VNodeTemplate } from './types/VNodeTemplate'

/**
 * Sane defaults for instantiating nodes.
 */
export const defaultVNodeTemplate: VNodeTemplate = {
    material: {
        stroke: {
            active: '#76FF02',
            normal: '#3FC4FF'
        }
    },
    name: 'identity'
}
