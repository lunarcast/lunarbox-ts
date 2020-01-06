import { Label } from '../types/Labels'

export const isOfLabel = <T extends Label>(type: T) => (input: Label) =>
    input === type
