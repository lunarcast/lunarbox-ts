import { array } from 'fp-ts/es6/Array'
import { constant, flow, identity } from 'fp-ts/es6/function'
import * as Option from 'fp-ts/es6/Option'
import { option, some } from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { Fragment, h } from 'preact'
import { memo } from 'preact/compat'
import { tryUpdateAt } from '../../fp/array/helpers/tryUpdateAt'
import { useEffectufulCallback } from '../../fp/hooks/useEffectufulCallback'
import { pinTypes } from '../constants'
import { useEditor } from '../contexts/editor'
import { calculatePinPosition } from '../helpers/calculatePinPosition'
import { connectionInProgress, nodeById } from '../lenses/editorState'
import { connectionInProgressMonoid } from '../monoids/connectionInProgress'
import { VNodeState } from '../types/VNodeState'
import { PinTemplate } from '../types/VNodeTemplate'
import { VPinPointer } from '../types/VPinPointer'
import { tuple } from 'fp-ts/es6/Tuple'
import { connections } from '../lenses/vNodeState'

interface Props {
    pin: PinTemplate
    index: number
    state: VNodeState
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
            const { material, shape } = template

            const fill = selected
                ? material.stroke.active
                : material.stroke.normal
            const [x, y] = calculatePinPosition(
                index,
                type,
                transform.scale,
                template
            )

            const editorProfunctorState = useEditor()

            const handleClick = useEffectufulCallback(() => {
                const setter = flow(
                    connectionInProgress.modify(
                        tryUpdateAt(
                            type,
                            Option.some({
                                index,
                                nodeId: id
                            })
                        )
                    ),
                    state =>
                        pipe(
                            state.connectionInProgress,
                            array.sequence(option),
                            Option.fold(constant(identity), ([start, end]) =>
                                flow(
                                    connectionInProgress.set(
                                        connectionInProgressMonoid.empty
                                    ),
                                    nodeById(end.nodeId)
                                        .compose(connections)
                                        .modify(
                                            tryUpdateAt(end.index, some(start))
                                        )
                                )
                            )
                        )(state)
                )

                const setState = pipe(
                    editorProfunctorState,
                    Option.map(s => s.setState)
                )

                return () => pipe(setState, Option.ap(Option.some(setter)))
            })

            return (
                <circle
                    r={shape.pinRadius}
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
