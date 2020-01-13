import { Nullable } from '@thi.ng/api'
import { Cursor } from '@thi.ng/atom'
import { VNodeState } from '../types/EditorState'

export class VNodeListCell {
    /**
     * Node of a hashed linked list of visual nodes.
     *
     * @param next The next node in the list.
     * @param previous The previous node in the list.
     * @param state The data to store.
     * @param id The id of the node
     */
    public constructor(
        public next: Nullable<VNodeListCell>,
        public previous: Nullable<VNodeListCell>,
        public state: Cursor<VNodeState>,
        public id: number
    ) {}
}

export class VNodeList {
    /**
     * Hashmap to get any node by it's id with O(1) complexity
     */
    private hashmap = new Map<number, VNodeListCell>()

    /**
     * The first element from the list.
     */
    private head: Nullable<VNodeListCell> = null

    /**
     * Get a node by it's id.
     *
     * @param id The id of the node to get.
     */
    public getNodeById(id: number) {
        return this.hashmap[id]
    }

    /**
     * Reciprocally bind 2 nodes
     *
     * @param first The first node.
     * @param other The second node.
     */
    private bind(
        first: Nullable<VNodeListCell>,
        other: Nullable<VNodeListCell>
    ) {
        if (first) {
            first.previous = other
        }

        if (other) {
            other.next = first
        }
    }

    /**
     * Add a new node at the top of the list.
     *
     * @param data The state of the node to add.
     */
    public spawn(id: number, data: Cursor<VNodeState>) {
        const newNode = new VNodeListCell(null, null, data, id)

        this.hashmap.set(id, newNode)
        this.lift(id)
    }

    /**
     * Moves a node on top.
     *
     * @param id The id of the node to lift.
     */
    public lift(id: number) {
        const node = this.hashmap.get(id)

        // If we can't find the node  we can safely return
        if (!node || this.head === node) {
            return
        }

        this.bind(node.next, node.previous)
        this.bind(node, this.head)

        this.head = node
    }

    /**
     * Iterate over all the nodes in the list.
     */
    public *[Symbol.iterator]() {
        let node = this.head

        while (node) {
            yield node
            node = node.previous
        }
    }

    /**
     * Cast this to an array.
     */
    public toArray() {
        return [...this].reverse()
    }
}
