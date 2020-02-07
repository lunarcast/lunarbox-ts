import { Label, LabelValue } from '../../typeChecking/types/Labels'
import { fold, SNode } from '../types/SNode'

type NodeValueGetter = <A extends Label, B extends Label>(
    node: SNode<A, B>
) => LabelValue<B>

/**
 * Recursively get the value of a node.
 */
export const getNodeValue: NodeValueGetter = fold(
    (arrow, input) => arrow.mapValue(getNodeValue(input())),
    output => output,
    (getLambda, getInput) => {
        const lambda = getNodeValue(getLambda())
        const input = getNodeValue(getInput())

        return lambda.mapValue(input)
    }
)
