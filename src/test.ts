import { stream, Stream } from '@thi.ng/rstream'
import { initGraph } from './modules/dataflow/helpers/initGraph'
import { SNode, SNodeKinds } from './modules/dataflow/types/SGraph'
import { isOfLabel } from './modules/typeChecking/helpers/isOfLabel'
import {
    LabelCode,
    SNumber,
    SVariableInstance
} from './modules/typeChecking/types/Labels'

const constantNode = <T extends SVariableInstance>(
    value: T
): [SNode, Stream<SVariableInstance>] => {
    const output = stream<T>(s => {
        s.next(value)
    })

    return [
        {
            kind: SNodeKinds.input,
            transformation: v => v,
            inputs: [],
            outputs: [
                {
                    source: output,
                    computeOutputLabel: () => value.type
                }
            ]
        },
        output
    ]
}

const [a, sourceA] = constantNode({
    type: LabelCode.number,
    value: 1
})

const [b, sourceB] = constantNode({
    type: LabelCode.number,
    value: 2
})

const adderSource = stream<SNumber>(s =>
    s.next({
        type: LabelCode.number,
        value: 0
    })
)

const adder: SNode = {
    kind: SNodeKinds.general,
    inputs: [
        {
            connection: {
                node: () => a,
                index: 0
            },
            labelConstraint: isOfLabel(LabelCode.boolean),
            labelName: 'number',
            id: 0
        },
        {
            connection: {
                node: () => adder,
                index: 0
            },
            labelConstraint: isOfLabel(LabelCode.number),
            labelName: 'number',
            id: 1
        }
    ],
    outputs: [
        {
            source: adderSource,
            computeOutputLabel: ([a, b]) => (a === b ? a : LabelCode.void)
        }
    ],
    transformation: inputs => [
        {
            type: LabelCode.number,
            value: inputs.reduce((a, b) => {
                if (b.type !== LabelCode.number) {
                    throw new Error('something went wrong')
                }

                return a + (b.value ?? 0)
            }, 0)
        }
    ]
}

const output: SNode = {
    kind: SNodeKinds.output,
    inputs: [
        {
            connection: {
                node: () => adder,
                index: 0
            },
            labelConstraint: () => true,
            labelName: 'anything',
            id: 1
        }
    ],
    outputs: [],
    transformation: inputs => {
        return []
    }
}

const graph = [a, b, adder, output]

initGraph(graph)

sourceA.next({
    value: 1,
    type: LabelCode.number
})
