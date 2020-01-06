import { Some } from "@adrielus/option";
import { stream, Stream, trace } from "@thi.ng/rstream";
import { initGraph } from "./helpers/initGraph";
import { isOfType } from "./helpers/labelValidation";
import { PrimitiveLabels, SVariableInstance } from "./types/Labels";
import { SNode, SNodeKinds } from "./types/VGraph";

const constantNode = <T extends SVariableInstance>(
  value: T
): [SNode, Stream<SVariableInstance>] => {
  const output = stream<T>(s => {
    s.next(value);
  });

  return [
    {
      kind: SNodeKinds.input,
      transformation: v => v,
      inputs: [],
      outputs: [
        {
          source: output,
          computeOutputKind: () => value.type
        }
      ]
    },
    output
  ];
};

const [a, sourceA] = constantNode({
  type: PrimitiveLabels.number,
  value: 1
});

const [b, sourceB] = constantNode({
  type: PrimitiveLabels.number,
  value: 2
});

const adderSource = stream<any>();

const adder: SNode = {
  kind: SNodeKinds.general,
  inputs: [
    {
      connection: Some({
        node: () => a,
        index: 0
      }),
      labelConstraint: isOfType(PrimitiveLabels.number),
      labelName: "number"
    },
    {
      connection: Some({
        node: () => b,
        index: 0
      }),
      labelConstraint: isOfType(PrimitiveLabels.number),
      labelName: "number"
    }
  ],
  outputs: [
    {
      source: adderSource,
      computeOutputKind: () => PrimitiveLabels.number
    }
  ],
  transformation: inputs => [
    {
      type: PrimitiveLabels.number,
      value: inputs.reduce((a, b) => {
        if (b.type !== PrimitiveLabels.number) {
          throw new Error("something went wrong");
        }

        return a + b.value;
      }, 0)
    }
  ]
};

const output: SNode = {
  kind: SNodeKinds.output,
  inputs: [
    {
      connection: Some({
        node: () => adder,
        index: 0
      }),
      labelConstraint: () => true,
      labelName: "anything"
    }
  ],
  outputs: [],
  transformation: inputs => {
    console.log(inputs);
    return [];
  }
};

const graph = [a, b, adder, output];

initGraph(graph);

sourceB.next({
  value: 7,
  type: PrimitiveLabels.number
});

sourceA.next({
  value: 5,
  type: PrimitiveLabels.number
});
