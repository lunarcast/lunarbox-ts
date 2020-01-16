import { useProfunctorState } from '@staltz/use-profunctor-state'
import { add2, sub2 } from '@thi.ng/vectors'
import * as Array from 'fp-ts/es6/Array'
import { array } from 'fp-ts/es6/Array'
import { constant, flow, tuple, constVoid } from 'fp-ts/es6/function'
import { IO, io } from 'fp-ts/es6/IO'
import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import * as Reader from 'fp-ts/es6/Reader'
import * as Record from 'fp-ts/es6/Record'
import * as State from 'fp-ts/es6/State'
import { snd } from 'fp-ts/es6/Tuple'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { MouseButtons } from '../../core/constants'
import { getElementId } from '../../core/lenses/html'
import { full } from '../../core/styles/full'
import { resolveEventTarget } from '../helpers/resolveEventTarget'
import { selectNode } from '../helpers/selectNode'
import { spawnNode } from '../helpers/spawnNode'
import { startsWith } from '../helpers/startsWith'
import { unselectNodes } from '../helpers/unselectNodes'
import { liftNode } from '../lenses/liftNode'
import { setSelectedNodes } from '../lenses/nodesArray'
import { EditorState, vNodeOrd, VNodeState } from '../types/EditorState'
import { Node } from './Node'
import { useEffectufulCallback } from '../../fp/helpers/useEffectufulCallback'
import { option } from 'fp-ts/es6/Option'

export const Editor = () => {
    const { state, setState } = useProfunctorState<EditorState>({
        laseZIndex: -1,
        nodes: {}
    })

    // At the start of the program we spawn 2 nodes for testing
    // TODO remove
    useEffect(() => {
        const spawner = constant(spawnNode())

        const spawn = flow(
            spawner,
            State.chain(spawner),
            Reader.chain(flow(snd, constant))
        )

        const sideEffect: IO<void> = flow(spawn, setState)

        sideEffect()
    }, [])

    const [lastMousePosition, setLastMousePosition] = useState<
        Option.Option<number[]>
    >(Option.none)

    const handleMouseUp = pipe(
        [
            () => setState(unselectNodes),
            () => setLastMousePosition(Option.none)
        ],
        array.sequence(io)
    )

    const handleMouseDown = useEffectufulCallback(
        ({ target, buttons }: MouseEvent) => {
            if (!(buttons & MouseButtons.left)) {
                return constVoid
            }

            // prefix related stuff
            const prefix = 'node-'
            const predicate = flow(getElementId, startsWith(prefix))
            const withoutPrefix = (s: string) => s.substr(prefix.length)

            // Id of the node clicked
            return pipe(
                target,
                Option.fromNullable,
                resolveEventTarget(predicate),
                Option.map(element => {
                    const id = pipe(
                        element,
                        getElementId,
                        withoutPrefix,
                        Number
                    )

                    const stateUpdater = flow(
                        liftNode(id),
                        unselectNodes,
                        selectNode(id)
                    )

                    return () => setState(stateUpdater)
                }),
                option.sequence(io)
            )
        }
    )

    const handleMouseMove = useEffectufulCallback(
        ({ clientX, clientY, buttons }: MouseEvent) => {
            if (!(buttons & MouseButtons.left)) {
                return constVoid
            }

            const currentPosition = [clientX, clientY]

            const moveIO: IO<void> = pipe(
                lastMousePosition,
                Option.map(position => {
                    const delta = sub2(
                        [],
                        currentPosition,
                        position
                    ) as number[]

                    return () =>
                        setState(
                            setSelectedNodes(
                                VNodeState.transform.position.set(
                                    old => add2([], delta, old) as number[]
                                )
                            )
                        )
                }),
                option.sequence(io)
            )

            const currentPositionUpdater: IO<void> = () =>
                pipe(currentPosition, Option.some, setLastMousePosition)

            return array.sequence(io)([currentPositionUpdater, moveIO])
        }
    )

    const children = pipe(
        state.nodes,
        Record.collect(flow(tuple, snd)),
        Array.sort(vNodeOrd),
        Array.map(node => <Node {...node} key={node.id} />)
    )

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
