import { identity } from 'fp-ts/es6/function'
import { none, some } from 'fp-ts/es6/Option'
import { h } from 'preact'
import { getNodeValue } from '../../dataflow/helpers/getNodeValue'
import { sArrow, sConstant, sPipe } from '../../dataflow/types/SNode'
import { Editor } from '../../editor/components/Editor'
import { ArrowLabel, Label, LabelCode } from '../../typeChecking/types/Labels'
import { validateNode } from '../../typeChecking/helpers/validateNode'

const constNumber = sConstant(7, [LabelCode.number])
const identityNode = sArrow(
    {
        mapLabel: some,
        mapValue: identity
    },
    () => constNumber
)

const addNode = sArrow<
    Label<LabelCode.number>,
    ArrowLabel<Label<LabelCode.number>, Label<LabelCode.number>>
>(
    {
        mapLabel: ([code]) =>
            code === LabelCode.number
                ? some([
                      LabelCode.arrow,
                      [LabelCode.number],
                      [LabelCode.number]
                  ])
                : none,
        mapValue: n1 => ({
            mapValue: n2 => n1 + n2,
            mapLabel: ([code]) =>
                code === (LabelCode.string as any)
                    ? some([LabelCode.number])
                    : none
        })
    },
    () => identityNode
)

const additionResult = sPipe(
    () => addNode,
    () => constNumber
)

export const App = () => {
    console.log(getNodeValue(additionResult))
    console.log(validateNode(additionResult))

    return <Editor />
}
