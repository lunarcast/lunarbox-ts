import { combine, iter } from "@adrielus/option";
import {
  fromIterable,
  metaStream,
  pubsub,
  stream,
  sync
} from "@thi.ng/rstream";
import * as tx from "@thi.ng/transducers";
import {
  VfpModule,
  VfpNode,
  VfpNodeOfType,
  VfpNodeType,
  VfpPinPointer,
  VfpValue
} from "./types";

export const getNodesOfType = <T extends VfpNodeType>(
  type: T,
  nodes: VfpNode[]
) => nodes.filter(node => node.type === type) as VfpNodeOfType<T>[];

export const initGraph = (module: VfpModule) => {
  for (const node of module.nodes) {
    const inputs = combine(node.inputs);

    iter((inputs: VfpPinPointer[]) => {
      const streams = inputs.map(input => input.node().outputs[input.index]);
      const merged = sync<VfpValue, Record<string, VfpValue>>({
        src: streams
      }).transform(tx.map(o => Object.values(o) as number[]));

      const results = merged.transform(tx.map(node.transformation));

      const indexedResults = results.subscribe(
        metaStream<VfpValue[], [number, VfpValue]>(inputs => {
          return fromIterable(tx.indexed(inputs));
        })
      );

      const splitter = pubsub({
        topic: ([index, _]: [number, VfpValue]) => index
      });

      indexedResults.subscribe(splitter);

      for (let index = 0; index < node.outputs.length; index++) {
        const pipe = stream<[number, VfpValue]>().transform(tx.map(v => v[1]));

        // this binds everything together
        pipe.subscribe(node.outputs[index]);
        splitter.subscribeTopic(index, pipe);
      }
    }, inputs);
  }
};
