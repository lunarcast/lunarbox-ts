import { Lens } from 'monocle-ts'
import { EditorState } from '../types/EditorState'
import { pinTypes } from '../constants'

const EditorStateLens = Lens.fromProp<EditorState>()
export const createConnectionInProgressLens = Lens.fromProp<
    EditorState['connectionInProgress']
>()

export const lastZIndex = EditorStateLens('lastZIndex')
export const nodes = EditorStateLens('nodes')
export const connectionInProgress = EditorStateLens('connectionInProgress')

export const start = createConnectionInProgressLens(pinTypes.output)
export const end = createConnectionInProgressLens(pinTypes.input)

export const node = Lens.fromProp<EditorState['nodes']>()

export const nodeById = (id: number) => nodes.compose(node(id))
