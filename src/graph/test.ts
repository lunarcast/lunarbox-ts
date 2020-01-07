import { stream, Stream } from '@thi.ng/rstream'
import { initGraph } from './helpers/initGraph'
import { isOfLabel } from './helpers/labelValidation'
import { Label, SNumber, SVariableInstance } from './types/Labels'
import { SNode, SNodeKinds } from './types/VGraph'

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
                    computeOutputKind: () => value.type
                }
            ]
        },
        output
    ]
}

const [a, sourceA] = constantNode({
    type: Label.number,
    value: 1
})

const [b, sourceB] = constantNode({
    type: Label.number,
    value: 2
})

const adderSource = stream<SNumber>(s =>
    s.next({
        type: Label.number,
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
            labelConstraint: isOfLabel(Label.boolean),
            labelName: 'number',
            id: 0
        },
        {
            connection: {
                node: () => adder,
                index: 0
            },
            labelConstraint: isOfLabel(Label.number),
            labelName: 'number',
            id: 1
        }
    ],
    outputs: [
        {
            source: adderSource,
            computeOutputKind: ([a, b]) => (a === b ? a : Label.void)
        }
    ],
    transformation: inputs => [
        {
            type: Label.number,
            value: inputs.reduce((a, b) => {
                if (b.type !== Label.number) {
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
        console.log(inputs)
        return []
    }
}

const graph = [a, b, adder, output]

initGraph(graph)

sourceA.next({
    value: 1,
    type: Label.number
})
