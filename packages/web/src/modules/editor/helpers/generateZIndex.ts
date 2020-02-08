import { increment } from 'fp-ts/es6/function'
import { State } from 'fp-ts/es6/State'
import { lastZIndex } from '../lenses/editorState'
import { EditorState } from '../types/EditorState'

/**
 * Takes an editor state and returns a new one and a new z index.
 *
 * @param state The editor state to use for the generation.
 */
export const generateZIndex: State<EditorState, number> = (
    state: EditorState
) => {
    const last = lastZIndex.get(state)
    const newState = lastZIndex.modify(increment)(state)

    return [last + 1, newState]
}
