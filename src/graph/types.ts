import { Nullable } from "@thi.ng/api";
import { Stream } from "@thi.ng/rstream";
import { Option } from "@adrielus/option";

export type VfpValue = number;

export enum VfpNodeType {
  general,
  input,
  output
}

export interface VfpPinPointer {
  index: number;
  node: () => VfpNode;
}

export interface VfpCommonNode {
  transformation: (inputs: VfpValue[]) => VfpValue[];
  inputs: Option<VfpPinPointer>[];
  outputs: Stream<VfpValue>[];
  type: VfpNodeType;
}

export interface VfpGeneralNode extends VfpCommonNode {
  type: VfpNodeType.general;
}

export interface VfpOutput extends VfpCommonNode {
  outputs: [];
  type: VfpNodeType.output;
}

export interface VfpInput extends VfpCommonNode {
  inputs: [];
  outputs: Exclude<Stream<VfpValue>[], []>;
  type: VfpNodeType.input;
}

export type VfpNodeOfType<T extends VfpNodeType> = {
  [VfpNodeType.general]: VfpGeneralNode;
  [VfpNodeType.input]: VfpInput;
  [VfpNodeType.output]: VfpOutput;
}[T];

export type VfpNode = VfpNodeOfType<VfpNodeType>;

export interface VfpModule {
  nodes: VfpNode[];
}

export interface VfpWorkspace {
  modules: VfpModule[];
}
