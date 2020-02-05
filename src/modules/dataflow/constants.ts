import { stream } from '@thi.ng/rstream'
import { LabelCode } from '../typeChecking/types/Labels'
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
            computeOutputLabel: () => LabelCode.void,
            source: stream()
        }
    ]
}
