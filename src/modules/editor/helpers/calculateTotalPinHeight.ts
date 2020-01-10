/**
 * Calculates how much a bunch of pins (+ spacing) will mesaure vertically.
 *
 * @param total Pin count.
 * @param radius Radis of each pin.
 */
export const calculateTotalPinHeight = (total: number, radius: number) =>
    (total * 2 + 1) * radius * 2
