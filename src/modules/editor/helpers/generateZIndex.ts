import { EditorState } from '../types/EditorState'
import { State } from 'fp-ts/es6/State'

const getLastZIndex = EditorState.laseZIndex.get()

/**
 * Takes an editor state and returns a new one and a new z index.
 *
 * @param state The editor state to use for the generation.
 */
export const generateZIndex: State<EditorState, number> = (
    state: EditorState
) => {
    const last = getLastZIndex(state)
    const newState = EditorState.laseZIndex.set(v => v + 1)(state)

    return [last + 1, newState]
}
