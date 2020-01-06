import { stream, sync, trace } from "@thi.ng/rstream";
import { map } from "@thi.ng/transducers";

const a = stream();
const b = sync({ src: [a] }).transform(map(Object.values));

b.subscribe(trace());

a.next(1);
a.next(2);
