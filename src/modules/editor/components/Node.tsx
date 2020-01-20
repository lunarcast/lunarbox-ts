import { add2, divN2, sub2 } from '@thi.ng/vectors'
import { h } from 'preact'
import { memo } from 'preact/compat'
import { bullet } from '../helpers/bullet'
import { VNodeState } from '../types/VNodeState'
import { VNodeTemplate } from '../types/VNodeTemplate'
import { InputPin, OutputPin } from './Pin'

const getNodeInfo = ({ label, pins }: VNodeTemplate) =>
    [
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

interface Props {
    state: VNodeState
}

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const Node = memo(({ state }: Props) => {
    const {
        template: { label, material, shape, pins, content },
        selected,
        transform: { position, scale },
        id
    } = state

    return (
        <g class="unselectable" transform={`translate(${position})`}>
            <title>{getNodeInfo(state.template)}</title>
            <rect
                id={`node-${id}`}
                width={scale[0]}
                height={scale[1]}
                fill={material.fill}
                opacity={material.opacity}
                stroke={material.stroke[selected ? 'active' : 'normal']}
                strokeWidth={shape.strokeWidth}
                rx={shape.borderRadius}
            />

            <text
                x={scale[0] + 2 * shape.strokeWidth + label.size / 2}
                y={scale[1] / 2 + shape.strokeWidth}
                fontSize={label.size}
                dominantBaseline="middle"
                textAnchor="start"
                fill={label.fill}
                class="overpass"
            >
                {label.text}
            </text>

            {pins.inputs.flatMap((pin, index) => (
                <InputPin {...{ index, pin, state }} key={index} />
            ))}
            {pins.outputs.flatMap((pin, index) => (
                <OutputPin {...{ index, pin, state }} key={index} />
            ))}

            <g
                id={`node-${id}`}
                transform={`translate(${add2(
                    [],
                    Array(2).fill(shape.strokeWidth),
                    divN2(null, sub2([], scale, content.scale), 2)
                )})`}
            >
                {content.generate(state)}
            </g>
        </g>
    )
})
