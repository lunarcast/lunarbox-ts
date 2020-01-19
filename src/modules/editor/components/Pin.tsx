import * as Array from 'fp-ts/es6/Array'
import { constant, flow } from 'fp-ts/es6/function'
import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { Fragment, h } from 'preact'
import { memo } from 'preact/compat'
import { useEffectufulCallback } from '../../fp/hooks/useEffectufulCallback'
import { nodeTypes } from '../constants'
import { useEditor } from '../contexts/editor'
import { calculateTotalPinWidth } from '../helpers/calculateTotalPinWidth'
import {
    connectionInProgress,
    end,
    nodeById,
    start
} from '../lenses/editorState'
import { connections } from '../lenses/vNodeState'
import { EditorState, VNodeState } from '../types/EditorState'
import { PinTemplate, VNodeTemplate } from '../types/VNodeTemplate'
import { tryUpdateAt } from '../../fp/array/helpers/tryUpdateAt'
import { some } from 'fp-ts/es6/Option'

/**
 * Get the position of any pin
 *
 * @param index The index of the pin.
 * @param nodeType The type of the pin.
 * @param scale The scale of the node.
 * @param template The template to use for the node
 */
export const calculatePinPosition = (
    index: number,
    nodeType: nodeTypes,
    scale: [number, number],
    { shape, pins }: VNodeTemplate
) => {
    const total = (nodeType === nodeTypes.input ? pins.inputs : pins.outputs)
        .length

    const xOffset =
        (scale[0] - calculateTotalPinWidth(total, shape.pinRadius)) / 2
    const rawX =
        calculateTotalPinWidth(index, shape.pinRadius) + shape.pinRadius
    const x = rawX + xOffset

    const y = nodeType === nodeTypes.input ? 0 : scale[1]

    return [x, y] as const
}

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
const Pin = (type: nodeTypes) =>
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
                const setter = Option.some((state: EditorState) => {
                    if (type === nodeTypes.input) {
                        return connectionInProgress.compose(end).set(
                            Option.some({
                                nodeId: id,
                                index
                            })
                        )(state)
                    }

                    return pipe(
                        state.connectionInProgress.end,
                        Option.fold(
                            constant(
                                connectionInProgress.compose(start).set(
                                    Option.some({
                                        nodeId: id,
                                        index
                                    })
                                )
                            ),
                            end =>
                                flow(
                                    connectionInProgress.set({
                                        end: Option.none,
                                        start: Option.none
                                    }),
                                    nodeById(id)
                                        .compose(connections)
                                        .modify(tryUpdateAt(index, some(end)))
                                )
                        )
                    )(state)
                })

                const setState = pipe(
                    editorProfunctorState,
                    Option.map(s => s.setState)
                )

                return () => pipe(setState, Option.ap(setter))
            })

            return (
                <Fragment>
                    <circle
                        r={shape.pinRadius}
                        cx={x}
                        cy={y}
                        fill={fill}
                        onClick={handleClick}
                    ></circle>
                    <title>{pin.label}</title>
                </Fragment>
            )
        }
    )

export const OutputPin = Pin(nodeTypes.output)
export const InputPin = Pin(nodeTypes.input)
