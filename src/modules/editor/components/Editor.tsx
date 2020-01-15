import { useProfunctorState } from '@staltz/use-profunctor-state'
import { Nullable } from '@thi.ng/api'
import { flow } from 'fp-ts/es6/function'
import * as IO from 'fp-ts/es6/IO'
import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { MouseButtons } from '../../core/constants'
import { getElementId } from '../../core/lenses/html'
import { full } from '../../core/styles/full'
import { identitySetter } from '../../lens/helpers/identitySetter'
import { resolveEventTarget } from '../helpers/resolveEventTarget'
import { spawnNode } from '../helpers/spawnNode'
import { startsWith } from '../helpers/startsWith'
import { liftNode } from '../lenses/liftNode'
import { getNodesArray } from '../lenses/nodesArray'
import { unselectNodes } from '../lenses/unselectNodes'
import { EditorState } from '../types/EditorState'
import { renderNode } from './Node'

export const Editor = () => {
    const { promap, setState, state } = useProfunctorState<EditorState>({
        laseZIndex: -1,
        nodes: {}
    })

    useEffect(() => {
        const [_, newState] = spawnNode()(state)

        pipe(newState, IO.of, setState)
    }, [])

    const { state: nodes } = promap(getNodesArray, identitySetter)

    const [_, setDelta] = pipe([0, 0], Option.some, useState)

    const handleMouseUp = () => {
        setDelta(Option.none)
        setState(unselectNodes)
    }

    const handleMouseDown = ({ target, buttons }: MouseEvent) => {
        if (!(buttons & MouseButtons.left)) {
            return
        }

        // prefix related stuff
        const prefix = 'node-'
        const predicate = flow(getElementId, startsWith(prefix))
        const withoutPrefix = (s: string) => s.substr(prefix.length)

        // Id of the node clicked
        const id = pipe(
            target as Nullable<HTMLElement>,
            Option.fromNullable,
            resolveEventTarget(predicate),
            Option.map(flow(getElementId, withoutPrefix, Number))
        )

        // this modifies the state of the app
        const update = (id: number) => flow(liftNode(id), unselectNodes)

        // this commits the state
        return pipe(id, Option.map(flow(update, setState)))
    }

    return (
        <svg
            style={{ ...full, background: '#222222' }}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
        >
            {nodes.map(renderNode)}
        </svg>
    )
}

//                         // select the thing the user clicked on
//                         if (node.state.deref().id === id) {
//                             node.state.resetIn('selected', true)
//                         }
//                     }
//                 }
//             })

//         drags
//             .transform(
//                 tx.comp(
//                     tx.map(e => [e.clientX, e.clientY] as const), // only keep what we need
//                     tx.dedupe() // remove duplicates
//                 )
//             )
//             .subscribe({
//                 next: position => {
//                     // We need this because we are not sure
//                     // we have a previous delta to go of
//                     Option.map((oldDelta: ReadonlyArray<number>) => {
//                         // The amount the mouse moved since the last update
//                         const diff = sub2([], position, oldDelta)

//                         // move the nodes which are selected
//                         for (const node of this.selectedNodes) {
//                             node.state.swapIn(
//                                 'transform.position',
//                                 (input: number[]) => {
//                                     // move the input by the mouse difference
//                                     return add2([], diff, input)
//                                 }
//                             )
//                         }
//                     })(delta.deref())

//                     // save current delta
//                     delta.reset(Option.some(position))
//                 }
//             })
