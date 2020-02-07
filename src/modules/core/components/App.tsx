import { h } from 'preact'
import { Editor } from '../../editor/components/Editor'

import { getNodeValue } from '../../dataflow/types/getNodeValue'
import { SNodeKinds, SNode } from '../../dataflow/types/SGraph'
import { some } from 'fp-ts/es6/Option'
import { identity } from 'fp-ts/es6/function'
import { LabelCode } from '../../typeChecking/types/Labels'
import { validateNode } from '../../typeChecking/helpers/validateNode'

const g: SNode = {
    id: 0,
    kind: SNodeKinds.normal,
    labelTransformer: {
        mapLabel: some,
        mapValue: identity
    },
    input: () => ({
        id: 1,
        kind: SNodeKinds.constant,
        input: () => {
            throw ''
        },
        labelTransformer: {
            mapLabel: () => some([LabelCode.number]),
            mapValue: () => 7
        }
    })
}

export const App = () => {
    console.log(getNodeValue(g))
    console.log(validateNode(g))

    return <Editor />
}
