import { Stream } from '@thi.ng/rstream'
import { Label, SVariableInstance } from '../../../typeChecking/types/Labels'

/**
 * Currently supported node kinds.
 */
export enum SNodeKinds {
    general,
    input,
    output
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
    node: () => SNode
}

/**
 * Input pin for all SNodes.
 */
export type SInputPin = {
    /**
     * Possible connection to another pin.
     */
    connection: SConnection

    /**
     * Predicate to validate incoming types.
     */
    labelConstraint: (type: Label) => boolean

    /**
     * For friendlier errors.
     */
    labelName: string

    /**
     * Id for the pin
     */
    id: number
}

/**
 * Output pin for all SNoes.
 */
export type SOutputPin = {
    /**
     * Method to compute the output type based on the input ones.
     */
    computeOutputKind: (inputTypes: Label[]) => Label

    /**
     * Stream pusing the latest values.
     */
    source: Stream<SVariableInstance>
}

export interface SNode {
    transformation: (inputs: SVariableInstance[]) => SVariableInstance[]
    inputs: SInputPin[]
    outputs: SOutputPin[]
    kind: SNodeKinds
}

/**
 * Convert node type to an actual node
 */
export type SNodeOfKind<T extends SNodeKinds> = SNode & {
    kind: {
        [SNodeKinds.general]: SNodeKinds.general
        [SNodeKinds.input]: SNodeKinds.input
        [SNodeKinds.output]: SNodeKinds.output
    }[T]
}
