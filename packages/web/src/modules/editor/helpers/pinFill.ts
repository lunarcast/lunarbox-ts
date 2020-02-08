import { NodeMaterial } from '../types/VNodeTemplate'
/**
 * Used to get the correct fill color of a pin
 *
 * @param selected Specifies if node the pin belongs to is currently selected.
 * @param material Material the node is made out of
 */
export function pinFill(selected: boolean, material: NodeMaterial) {
    return selected ? material.stroke.active : material.stroke.normal
}
