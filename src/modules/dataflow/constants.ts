import { SNode, SNodeKinds } from './types/SGraph'
import { Label } from '../typeChecking/types/Labels'
import { stream } from '@thi.ng/rstream'

/**
 * Empty node.
 */
export const voidNode: SNode = {
    kind: SNodeKinds.unique,
    inputs: [],
    transformation: () => [],
    outputs: [
        {
            computeOutputLabel: () => Label.void,
            source: stream()
        }
    ]
}
