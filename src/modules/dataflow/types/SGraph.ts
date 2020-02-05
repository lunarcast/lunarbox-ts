import { IO } from 'fp-ts/es6/IO'
import { Label, LabelT } from '../../typeChecking/types/Labels'

/**
 * Currently supported node kinds.
 */
export enum SNodeKinds {
    normal,
    constant
}

/**
 * Indicates what input pin an output pin is connected to.
 */
export type SConnection = {
    /**
     * The index of the input pin.
     */
    index: number

    /**
     * Lazy value containing the node the pin belongs to.
     *
     * @notice
     * This is lazy to allow stuff like:
     * ```ts
     * const a = {
     *  ...
     *    node: () => a
     *  ...
     * }
     * ```
     */
    node: IO<SNode>
}

/**
 * Input pin for all SNodes.
 */
export type SInputPin = {
    /**
     * Possible connection to another pin.
     */
    connection: SConnection
}

/**
 * Node of the any Simulation graphs.
 */
export interface SNode<T extends Label = Label, U extends Label = Label> {
    input: SConnection
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
