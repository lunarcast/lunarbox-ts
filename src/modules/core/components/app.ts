import { AppContext } from '../types/AppContext'
import { Editor } from '../../editor/components/editor'

const editor = new Editor()

export const app = (ctx: AppContext) => {
    return [editor]
}
