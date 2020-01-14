import { divN2, sub2 } from '@thi.ng/vectors'
import { bullet } from '../helpers/bullet'
import { calculateTotalPinWidth } from '../helpers/calculateTotalPinWidth'
import { VNodeState } from '../types/EditorState'
import { createPinRenderer } from './Pin'
import { h } from 'preact'

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const renderNode = (state: VNodeState) => {
    const {
        template: { label, material, shape, pins, content },
        selected,
        transform,
        id
    } = state

    const totalPinsWidth = calculateTotalPinWidth(
        Math.max(pins.inputs.length, pins.outputs.length),
        shape.pinRadius
    )

    const nodeWidth = Math.max(
        2 * shape.strokeWidth + totalPinsWidth,
        transform.scale[0],
        content.scale[0] + 2 * content.margin
    )

    const nodeHeight = Math.max(
        transform.scale[1],
        content.scale[1] + 2 * (content.margin + shape.pinRadius)
    )

    const scale = [nodeWidth, nodeHeight] as [number, number]

    const inputPinRenderer = createPinRenderer(1, scale, state)
    const outputPinRenderer = createPinRenderer(-1, scale, state)

    const info = [
        `Name: ${label.text}`,
        '',
        `Description: ${label.description}`,
        '',
        'Inputs:',
        ...pins.inputs.map(pin => bullet(pin.label)),
        '',
        'Outputs:',
        ...pins.outputs.map(pin => bullet(pin.label))
    ].join('\n')

    return (
        <g
            key={id}
            class="unselectable"
            transform={`translate(${transform.position})`}
        >
            <title>{info}</title>
            <rect
                id={`node-${id}`}
                width={nodeWidth}
                height={nodeHeight}
                fill={material.fill}
                opacity={material.opacity}
                stroke={material.stroke[selected ? 'active' : 'normal']}
                strokeWidth={shape.strokeWidth}
                rx={shape.borderRadius}
            />

            <text
                x={nodeWidth + 2 * shape.strokeWidth + label.size / 2}
                y={nodeHeight / 2}
                fontSize={label.size}
                dominantBaseline="middle"
                textAnchor="start"
                fill={label.fill}
                class="overpass"
            >
                {label.text}
            </text>

            {...pins.inputs.flatMap(inputPinRenderer)}
            {...pins.outputs.flatMap(outputPinRenderer)}

            <g
                id={`node-${id}`}
                transform={`translate(${divN2(
                    null,
                    sub2([], scale, content.scale),
                    2
                )})`}
            >
                {content.generate(state)}
            </g>
        </g>
    )
}
