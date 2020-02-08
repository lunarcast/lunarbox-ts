import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import { SNode, fold } from '../../dataflow/types/SNode'
import {
    LabelValidationFailureReasons,
    LabelValidationResult
} from '../types/Errors'
import { createLabelValidationError } from './createLabelValidationError'
import { LabelCode, Label, LabelT } from '../types/Labels'
import { A } from 'ts-toolbelt'
import { getNodeValue } from '../../dataflow/helpers/getNodeValue'

const validateArrow = <A extends Label, B extends Label>(
    arrow: LabelT<A, B>['mapLabel'],
    input: SNode<Label, A>
): LabelValidationResult<B> => {
    return pipe(
        input,
        validateNode,
        Either.chain(type => {
            const outputLabel = arrow(type)
            // TODO: make this use actual values.
            const error = createLabelValidationError(
                LabelValidationFailureReasons.typeMismatch
            )({
                expected: '',
                found: ''
            })
            return pipe(
                outputLabel,
                Either.fromOption(() => error)
            )
        })
    )
}

export const validateNode = <A extends Label, B extends Label>(
    node: SNode<A, B>
): LabelValidationResult<B> => {
    return pipe(
        node,
        fold(
            (arrow, input) => {
                return validateArrow(arrow.mapLabel, input())
            },
            (_, l) => Either.right(l),
            (lambda, input) => {
                const lambdaValue = getNodeValue(lambda())
                const altLambda = validateNode(lambda())

                return pipe(
                    altLambda,
                    Either.chain(arrow => {
                        arrow()
                    })
                )
            }
        )
    )
}
