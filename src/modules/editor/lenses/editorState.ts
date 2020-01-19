import { Lens } from 'monocle-ts'
import { EditorState } from '../types/EditorState'

const EditorStateLens = Lens.fromProp<EditorState>()
const ConnectionInProgress = Lens.fromProp<
    EditorState['connectionInProgress']
>()

export const lastZIndex = EditorStateLens('lastZIndex')
export const nodes = EditorStateLens('nodes')
export const connectionInProgress = EditorStateLens('connectionInProgress')

export const start = ConnectionInProgress('start')
export const end = ConnectionInProgress('end')

export const node = Lens.fromProp<EditorState['nodes']>()

export const nodeById = (id: number) => nodes.compose(node(id))
