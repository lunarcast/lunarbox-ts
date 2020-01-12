import { Stream } from '@thi.ng/rstream'
import { Label, SVariableInstance } from '../../typeChecking/types/Labels'
import { voideNode } from '../constants'

/**
 * Currently supported node kinds.
 */
export enum SNodeKinds {
    general,
    input,
    output,
    unique
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
    computeOutputLabel: (inputTypes: Label[]) => Label

    /**
     * Stream pusing the latest values.
     */
    source: Stream<SVariableInstance>
}

/**
 * Node of the any Simulation graphs.
 */
export interface SNode {
    /**
     * Function which takes the resolved inputs
     * and returns the values for the outputs.
     *
     * @param inputs The inputs to process
     * @returns The outputs of the node.
     */
    transformation: (inputs: SVariableInstance[]) => SVariableInstance[]

    /**
     * Array of input pins.
     */
    inputs: SInputPin[]

    /**
     * Array of output pins.
     */
    outputs: SOutputPin[]

    /**
     * Specifies what type of node this is.
     */
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
        [SNodeKinds.unique]: SNodeKinds.unique
    }[T]
}
