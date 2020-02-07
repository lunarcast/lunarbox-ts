import { IO } from 'fp-ts/es6/IO'
import {
    Label,
    LabelT,
    LabelCode,
    ArrowLabel
} from '../../typeChecking/types/Labels'

/**
 * Generated from ./SNode.hs
 */
export type SNode<A extends Label, B extends Label> =
    | {
          readonly type: 'SArrow'
          readonly value0: LabelT<A, B>
          readonly value1: () => SNode<Label, B>
      }
    | {
          readonly type: 'SConstant'
          readonly value0: B
      }
    | {
          readonly type: 'SPipe'
          readonly value0: () => SNode<Label, ArrowLabel<A, B>>
          readonly value1: () => SNode<Label, A>
      }

export function sArrow<A extends Label, B extends Label>(
    value0: LabelT<A, B>,
    value1: () => SNode<Label, B>
): SNode<A, B> {
    return { type: 'SArrow', value0, value1 }
}

export function sConstant<A extends Label, B extends Label>(
    value0: B
): SNode<A, B> {
    return { type: 'SConstant', value0 }
}

export function sPipe<A extends Label, B extends Label>(
    value0: () => SNode<Label, ArrowLabel<A, B>>,
    value1: () => SNode<Label, A>
): SNode<A, B> {
    return { type: 'SPipe', value0, value1 }
}

export function fold<A extends Label, B extends Label, R>(
    onSArrow: (value0: LabelT<A, B>, value1: () => SNode<Label, B>) => R,
    onSConstant: (value0: B) => R,
    onSPipe: (
        value0: () => SNode<Label, ArrowLabel<A, B>>,
        value1: () => SNode<Label, A>
    ) => R
): (fa: SNode<A, B>) => R {
    return fa => {
        switch (fa.type) {
            case 'SArrow':
                return onSArrow(fa.value0, fa.value1)
            case 'SConstant':
                return onSConstant(fa.value0)
            case 'SPipe':
                return onSPipe(fa.value0, fa.value1)
        }
    }
}
