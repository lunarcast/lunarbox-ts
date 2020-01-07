import { AppConext } from '../types/AppContext'
import { editor } from '../../editor/components/editor'

export const app = (ctx: AppConext) => {
    return [editor]
}
