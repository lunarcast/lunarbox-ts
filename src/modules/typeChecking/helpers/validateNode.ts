import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import { SNode, SNodeKinds } from '../../dataflow/types/SGraph'
import {
    LabelValidationFailureReasons,
    LabelValidationResult
} from '../types/Errors'
import { createLabelValidationError } from './createLabelValidationError'
import { LabelCode } from '../types/Labels'

export const validateNode = (node: SNode): LabelValidationResult => {
    if (node.kind === SNodeKinds.constant) {
        return pipe(
            node.labelTransformer.mapLabel([LabelCode.void]),
            Either.fromOption(() => ({
                reason: LabelValidationFailureReasons.unknownType
            }))
        )
    }

    return pipe(
        node.input(),
        validateNode,
        Either.chain(type => {
            const outputLabel = node.labelTransformer.mapLabel(type)

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
