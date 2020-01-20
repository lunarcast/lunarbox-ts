import { stream } from '@thi.ng/rstream'
import { Label } from '../typeChecking/types/Labels'
import { SNode, SNodeKinds } from './types/SGraph'

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
