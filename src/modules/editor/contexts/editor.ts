import { createOptionalContext } from '../../fp/helpers/createOptionalContext'
import { EditorState } from '../types/EditorState'
import { ProfunctorState } from '@staltz/use-profunctor-state'

export const [EditorProvider, useEditor] = createOptionalContext<
    ProfunctorState<EditorState>
>()
