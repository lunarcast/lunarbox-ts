import { SNode, SNodeKinds } from './types/SGraph'
import { Label } from '../typeChecking/types/Labels'
import { stream } from '@thi.ng/rstream'

/**
 * Empty node.
 */
export const voideNode: SNode = {
    kind: SNodeKinds.unique,
    inputs: [],
    transformation: () => [],
    outputs: [
        {
            computeOutputKind: () => Label.void,
            source: stream()
        }
    ]
}
