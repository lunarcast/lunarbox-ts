/**
 * Calculates how much a bunch of pins (+ spacing) will measure vertically.
 *
 * @param total Pin count.
 * @param radius Radius of each pin.
 */
export const calculateTotalPinWidth = (total: number, radius: number) =>
    (total * 2 + 1) * radius * 2
