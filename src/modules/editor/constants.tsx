import { VNodeTemplate } from './types/VNodeTemplate'
import { h, Fragment } from 'preact'

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
        opacity: 0.7,
        pinLabelFIll: `rgba(200,200,200,0.7)`
    },
    label: {
        text: 'Add',
        size: 20,
        fill: 'rgba(180,180,180,0.6)',
        description: 'Take the inputs and output their sum.'
    },
    shape: {
        borderRadius: 2,
        strokeWidth: 5,
        pinRadius: 10
    },
    content: {
        generate: ({ selected }) => (
            <Fragment>
                {/* <rect fill="yellow" width={30} height={20}></rect> */}
                <text
                    x={15}
                    y={10}
                    width={30}
                    height={20}
                    fontSize={20}
                    style={{ fill: 'white' }}
                    dominantBaseline="middle"
                    textAnchor="middle"
                >
                    {selected ? 'True' : 'False'}
                </text>
            </Fragment>
        ),
        scale: [30, 20],
        margin: 20
    },
    pins: {
        inputs: [
            {
                label: 'first number'
            },
            {
                label: 'second number'
            }
        ],
        outputs: [
            {
                label: 'result'
            }
        ]
    }
}

export enum nodeTypes {
    input,
    output
}
