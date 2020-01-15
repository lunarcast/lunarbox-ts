import { useProfunctorState } from '@staltz/use-profunctor-state'
import { Nullable } from '@thi.ng/api'
import { add2, sub2 } from '@thi.ng/vectors'
import * as Array from 'fp-ts/es6/Array'
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
import { selectNode } from '../helpers/selectNode'
import { spawnNode } from '../helpers/spawnNode'
import { startsWith } from '../helpers/startsWith'
import { unselectNodes } from '../helpers/unselectNodes'
import { liftNode } from '../lenses/liftNode'
import { getNodesArray, setSelectedNodes } from '../lenses/nodesArray'
import { EditorState, vNodeOrd, VNodeState } from '../types/EditorState'
import { renderNode } from './Node'

export const Editor = () => {
    const { promap, setState, state } = useProfunctorState<EditorState>({
        laseZIndex: -1,
        nodes: {}
    })

    useEffect(() => {
        const [, newState] = spawnNode()(state)
        const [, finalState] = spawnNode()(newState)

        pipe(finalState, IO.of, setState) //
    }, [])

    const { state: nodes } = promap(getNodesArray, identitySetter)
    const [lastMousePosition, setLastMousePosition] = useState<
        Option.Option<number[]>
    >(Option.none)

    const handleMouseUp = () => {
        setLastMousePosition(Option.none)
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
        const update = (id: number) =>
            flow(liftNode(id), unselectNodes, selectNode(id))

        // this commits the state
        return pipe(id, Option.map(flow(update, setState)))
    }

    const handleMouseMove = ({ clientX, clientY, buttons }: MouseEvent) => {
        const currentPosition = [clientX, clientY]

        if (!(buttons & MouseButtons.left)) {
            return
        }

        pipe(
            lastMousePosition,
            Option.map(position => {
                const delta = sub2([], currentPosition, position) as number[]

                return pipe(
                    state,
                    setSelectedNodes(
                        VNodeState.transform.position.set(
                            old => add2([], delta, old) as number[]
                        )
                    )
                )
            }),
            Option.map(flow(IO.of, setState))
        )

        pipe(currentPosition, Option.some, setLastMousePosition)
    }

    const children = pipe(nodes, Array.sort(vNodeOrd), Array.map(renderNode))

    return (
        <svg
            style={{ ...full, background: '#222222' }}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
        >
            {children}
        </svg>
    )
}
