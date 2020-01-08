import { Atom, Cursor } from '@thi.ng/atom'
import { ILifecycle } from '@thi.ng/hdom'
import { vec2 } from '@thi.ng/vectors'
import { AppConext } from '../../core/types/AppContext'
import { EditorState, VNodeState } from '../types/EditorState'

export class VNode implements ILifecycle {
    public id: number
    public state: Cursor<VNodeState>

    /**
     * General node component for all nodes in the editor.
     *
     * @param editorState
     */
    public constructor(private editorState: Atom<EditorState>) {
        this.editorState.swapIn('lastId', (lastId: number) => {
            this.id = lastId + 1
            return this.id
        })

        this.editorState.resetIn<VNodeState>(['nodes', this.id], {
            transform: {
                position: [100, 200],
                scale: [200, 300]
            }
        })

        this.state = new Cursor(this.editorState, ['nodes', this.id])
    }

    /**
     * Called by hdom on each render.
     */
    public render(_: AppConext) {
        const current = this.state.deref()

        return [
            'rect',
            {
                x: current.transform.position[0],
                y: current.transform.position[1],
                width: current.transform.scale[0],
                height: current.transform.scale[1],
                fill: 'white'
            }
        ]
    }
}
