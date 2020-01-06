import {
  VfpModule,
  VfpNodeType,
  VfpValue,
  VfpInput,
  VfpGeneralNode,
  VfpPinPointer,
  VfpOutput
} from "./types";
import { stream, Stream } from "@thi.ng/rstream";
import { Some } from "@adrielus/option";
import { initGraph } from "./initGraph";

const constantNode = <T extends VfpValue>(
  value: T
): [VfpInput, Stream<VfpValue>] => {
  const output = stream<T>();

  output.next(value);

  return [
    {
      type: VfpNodeType.input,
      transformation: v => v,
      inputs: [],
      outputs: [output]
    },
    output
  ];
};

const [a, sourceA] = constantNode(1);

const adder: VfpGeneralNode = {
  type: VfpNodeType.general,
  inputs: [
    Some<VfpPinPointer>({
      node: () => a,
      index: 0
    }),
    Some<VfpPinPointer>({
      node: () => adder,
      index: 0
    })
  ],
  outputs: [stream(s => s.next(1))],
  transformation: inputs => [inputs.reduce((a, b) => a + b, 0)]
};

const output: VfpOutput = {
  type: VfpNodeType.output,
  inputs: [
    Some({
      node: () => adder,
      index: 0
    })
  ],
  outputs: [],
  transformation: inputs => (console.log(inputs), [])
};

const graph: VfpModule = {
  nodes: [a, adder, output]
};

initGraph(graph);
