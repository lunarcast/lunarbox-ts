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
     */
    public constructor(
        public next: Nullable<VNodeListCell>,
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
     * The head of the list
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
     * Add a new node at the top of the list.
     *
     * @param data The state of the node to add.
     */
    public spawn(id: number, data: Cursor<VNodeState>) {
        const newNode = new VNodeListCell(this.head, data, id)

        this.hashmap.set(id, newNode)
        this.head = newNode
    }

    /**
     * Iterate over all the ndoes in the list.
     */
    public *[Symbol.iterator]() {
        let node = this.head

        while (node) {
            yield node
            node = node.next
        }
    }

    /**
     * Cast this to an array.
     */
    public toArray() {
        return [...this]
    }
}
