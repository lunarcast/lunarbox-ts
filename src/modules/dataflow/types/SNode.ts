import {
    ArrowLabel,
    Label,
    LabelT,
    LabelValue
} from '../../typeChecking/types/Labels'

/**
 * Same as SNode but the input can be anything
 */
export type SNodeWithOutput<A extends Label> = SNode<Label, A>

/**
 * SNode which allows any input / output
 */
export type SGeneralNode = SNode<Label, Label>

/**
 * Generated from ./SNode.hs
 */
export type SNode<A extends Label, B extends Label> =
    | {
          readonly type: 'SArrow'
          readonly value0: LabelT<A, B>
          readonly value1: () => SNodeWithOutput<A>
      }
    | {
          readonly type: 'SConstant'
          readonly value0: LabelValue<B>
      }
    | {
          readonly type: 'SPipe'
          readonly value0: () => SNodeWithOutput<ArrowLabel<A, B>>
          readonly value1: () => SNodeWithOutput<A>
      }

export function sArrow<A extends Label, B extends Label>(
    value0: LabelT<A, B>,
    value1: () => SNodeWithOutput<A>
): SNode<A, B> {
    return { type: 'SArrow', value0, value1 }
}

export function sConstant<A extends Label, B extends Label>(
    value0: LabelValue<B>
): SNode<A, B> {
    return { type: 'SConstant', value0 }
}

export function sPipe<A extends Label, B extends Label>(
    value0: () => SNodeWithOutput<ArrowLabel<A, B>>,
    value1: () => SNodeWithOutput<A>
): SNode<A, B> {
    return { type: 'SPipe', value0, value1 }
}

export function fold<A extends Label, B extends Label, R>(
    onSArrow: (value0: LabelT<A, B>, value1: () => SNodeWithOutput<A>) => R,
    onSConstant: (value0: LabelValue<B>) => R,
    onSPipe: (
        value0: () => SNodeWithOutput<ArrowLabel<A, B>>,
        value1: () => SNodeWithOutput<A>
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
