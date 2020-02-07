import { SNode, SNodeKinds } from './SGraph'

export const getNodeValue = (node: SNode) => {
    return node.kind === SNodeKinds.constant
        ? node.labelTransformer.mapValue(null)
        : node.labelTransformer.mapValue(getNodeValue(node.input()))
}
