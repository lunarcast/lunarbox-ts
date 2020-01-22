import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { h } from 'preact'
import { memo } from 'preact/compat'
import { useEffectufulCallback } from '../../fp/hooks/useEffectufulCallback'
import { pinTypes } from '../constants'
import { useEditor } from '../contexts/editor'
import { calculatePinPosition } from '../helpers/calculatePinPosition'
import { connectPins } from '../helpers/connectPins'
import { VNodeState } from '../types/VNodeState'
import { PinTemplate, NodeMaterial } from '../types/VNodeTemplate'

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

            const handleClick = useEffectufulCallback(() => {
                const setState = pipe(
                    editorProfunctorState,
                    Option.map(s => s.setState)
                )

                const setter = Option.some(connectPins({ type, index, id }))

                return () => pipe(setState, Option.ap(setter))
            })

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
