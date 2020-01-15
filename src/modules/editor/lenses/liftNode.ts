import { VNodeState, EditorState } from '../types/EditorState'
import { State } from 'fp-ts/es6/State'

const getLastZIndex = EditorState.laseZIndex.get()

const increaseZIndex: State<EditorState, number> = (state: EditorState) => {
    const last = getLastZIndex(state)
    const newState = EditorState.laseZIndex.set(v => v + 1)(state)

    return [last, newState]
}

/**
 * Lift a node on top of everything else.
 *
 * @param id The id of he node to lift.
 */
export const liftNode = (id: number) => (initial: EditorState) => {
    const [index, state] = increaseZIndex(initial)

    return EditorState.nodes.k(id).transform.zIndex.set(index)(state)
}
