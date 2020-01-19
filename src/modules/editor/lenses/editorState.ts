import { Lens } from 'monocle-ts'
import { EditorState } from '../types/EditorState'

const EditorStateLens = Lens.fromProp<EditorState>()

export const lastZIndex = EditorStateLens('lastZIndex')
export const nodes = EditorStateLens('nodes')

export const node = Lens.fromProp<EditorState['nodes']>()

export const nodeById = (id: number) => nodes.compose(node(id))
