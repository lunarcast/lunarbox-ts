import { IO } from 'fp-ts/es6/IO'
import { Label, LabelT, LabelCode } from '../../typeChecking/types/Labels'

/**
 * Currently supported node kinds.
 */
export enum SNodeKinds {
    normal,
    constant
}

/**
 * Node of the any Simulation graphs.
 */
export interface SNode<T extends Label = Label, U extends Label = Label> {
    input: IO<SNode>
    labelTransformer: LabelT<T, U>
    kind: SNodeKinds
    id: number
}

/**
 * Convert node type to an actual node
 */
export type SNodeOfKind<T extends SNodeKinds> = SNode & {
    kind: T
}

export type SConstantNode = SNode<Label<LabelCode.void>>
