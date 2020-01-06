import { Stream } from "@thi.ng/rstream";
import { Option, None } from "@adrielus/option";
import { SVariableInstance, SVariable, Label } from "./Labels";

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
type SConnection = {
  /**
   * The index of the input pin.
   */
  index: number;

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
  node: () => SNode;
};

/**
 * Input pin for all SNodes.
 */
export type SInputPin = {
  /**
   * Possible connection to another pin.
   */
  connection: Option<SConnection>;

  /**
   * Predicate to validate incoming types.
   */
  labelConstraint: (type: Label) => boolean;
};

/**
 * Output pin for all SNoes.
 */
export type SOutputPin = {
  /**
   * Method to compute the output type based on the input ones.
   */
  computeOutputType: (inputTypes: Label[]) => Label;
};

export interface SNode {
  transformation: (inputs: SVariableInstance[]) => SVariableInstance[];
  inputs?: Option<SInputPin>[];
  outputs?: Stream<SOutputPin>[];
  kind: SNodeKinds;
}

/**
 * Convert node type to an actual node
 */
export type SNodeOfKind<T extends SNodeKinds> = SNode & {
  kind: {
    [SNodeKinds.general]: SNodeKinds.general;
    [SNodeKinds.input]: SNodeKinds.input;
    [SNodeKinds.output]: SNodeKinds.output;
  }[T];
};
