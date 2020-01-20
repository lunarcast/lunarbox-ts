import { Lens } from 'monocle-ts'
import { EditorState } from '../types/EditorState'
import { pinTypes } from '../constants'

const EditorStateLens = Lens.fromProp<EditorState>()
const ConnectionInProgress = Lens.fromProp<
    EditorState['connectionInProgress']
>()

export const lastZIndex = EditorStateLens('lastZIndex')
export const nodes = EditorStateLens('nodes')
export const connectionInProgress = EditorStateLens('connectionInProgress')

export const start = ConnectionInProgress(pinTypes.output)
export const end = ConnectionInProgress(pinTypes.input)

export const node = Lens.fromProp<EditorState['nodes']>()

export const nodeById = (id: number) => nodes.compose(node(id))
