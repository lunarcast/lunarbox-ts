import { constant, flow, Endomorphism } from 'fp-ts/es6/function'
import * as IO from 'fp-ts/es6/IO'
import * as Option from 'fp-ts/es6/Option'
import { h } from 'preact'
import { memo } from 'preact/compat'
import { pinTypes } from '../constants'
import { useEditor } from '../contexts/editor'
import { calculatePinPosition } from '../helpers/calculatePinPosition'
import { connectPins } from '../helpers/connectPins'
import { VNodeState } from '../types/VNodeState'
import { NodeMaterial, PinTemplate } from '../types/VNodeTemplate'
import { EditorState } from '../types/EditorState'

interface Props {
    pin: PinTemplate
    index: number
    state: VNodeState
}

/**
 * Used to get the correct fill color of a pin
 *
 * @param selected Specifies if node the pin belongs to is currently selected.
 * @param material Material the node is made out of
 */
function pinFill(selected: boolean, material: NodeMaterial) {
    return selected ? material.stroke.active : material.stroke.normal
}

/**
 * Factory function for pin components.
 *
 * @param type The type of the pin
 */
const Pin = (type: pinTypes) =>
    memo(
        ({
            index,
            pin,
            state: { id, template, transform, selected }
        }: Props) => {
            const fill = pinFill(selected, template.material)

            const [x, y] = calculatePinPosition(
                index,
                type,
                transform.scale,
                template
            )

            const editorProfunctorState = useEditor()
            const pinConnecter: Endomorphism<EditorState> = connectPins({
                type,
                index,
                id
            })

            const handleClick: IO.IO<Option.Option<void>> = flow(
                constant(editorProfunctorState),
                Option.map(s => s.setState),
                Option.ap(Option.some(pinConnecter))
            )

            return (
                <circle
                    r={template.shape.pinRadius}
                    cx={x}
                    cy={y}
                    fill={fill}
                    onClick={handleClick}
                >
                    <title>{pin.label}</title>
                </circle>
            )
        }
    )

export const OutputPin = Pin(pinTypes.output)
export const InputPin = Pin(pinTypes.input)
