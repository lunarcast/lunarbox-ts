import { useProfunctorState } from '@staltz/use-profunctor-state'
import { add2, sub2 } from '@thi.ng/vectors'
import * as Array from 'fp-ts/es6/Array'
import { array } from 'fp-ts/es6/Array'
import { constant, constVoid, flow, tuple } from 'fp-ts/es6/function'
import { IO, io } from 'fp-ts/es6/IO'
import * as Option from 'fp-ts/es6/Option'
import { option } from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import * as Reader from 'fp-ts/es6/Reader'
import * as Record from 'fp-ts/es6/Record'
import * as State from 'fp-ts/es6/State'
import { snd } from 'fp-ts/es6/Tuple'
import { h } from 'preact'
import { useState } from 'preact/hooks'
import { MouseButtons } from '../../core/constants'
import { getElementId } from '../../core/lenses/html'
import { full } from '../../core/styles/full'
import { useEffectufulCallback } from '../../fp/hooks/useEffectufulCallback'
import { useIo } from '../../fp/hooks/useIO'
import { EditorProvider } from '../contexts/editor'
import { resolveEventTarget } from '../helpers/resolveEventTarget'
import { selectNode } from '../helpers/selectNode'
import { spawnNode } from '../helpers/spawnNode'
import { startsWith } from '../helpers/startsWith'
import { unselectNodes } from '../helpers/unselectNodes'
import { liftNode } from '../lenses/liftNode'
import { setSelectedNodes } from '../lenses/nodesArray'
import { nodePosition } from '../lenses/vNodeState'
import { connectionInProgressMonoid } from '../monoids/connectionInProgress'
import { vNodeOrd } from '../ords/vNodeOrd'
import { EditorState } from '../types/EditorState'
import { Node } from './Node'
import { NodeConnections } from './NodeConnections'

export const Editor = () => {
    const profunctorState = useProfunctorState<EditorState>({
        lastZIndex: -1,
        nodes: {},
        connectionInProgress: connectionInProgressMonoid.empty
    })

    const { state, setState } = profunctorState

    // At the start of the program we spawn 2 nodes for testing
    // TODO remove
    useIo(() => {
        const spawner = constant(spawnNode())

        const spawn = flow(
            spawner,
            State.chain(spawner),
            Reader.chain(flow(snd, constant))
        )

        return flow(spawn, setState)
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
                                nodePosition.modify(
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

    const nodes = pipe(
        state.nodes,
        Record.collect(flow(tuple, snd)),
        Array.sort(vNodeOrd)
    )

    const children = [
        ...pipe(
            nodes,
            Array.map(({ id }) => (
                <NodeConnections state={state} id={id} key={id} />
            ))
        ),
        ...pipe(
            nodes,
            Array.map(node => {
                return <Node state={node} key={node.id} />
            })
        )
    ]

    return (
        <EditorProvider value={profunctorState}>
            <svg
                style={{ ...full, background: '#222222' }}
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                {children}
            </svg>
        </EditorProvider>
    )
}
