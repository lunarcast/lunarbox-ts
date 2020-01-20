import { ProfunctorState } from '@staltz/use-profunctor-state'
import { createOptionalContext } from '../../fp/helpers/createOptionalContext'
import { EditorState } from '../types/EditorState'

export const [EditorProvider, useEditor] = createOptionalContext<
    ProfunctorState<EditorState>
>()
