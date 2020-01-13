import { SConnection, SOutputPin } from '../../dataflow/types/SGraph'

/**
 * Takes a connection and returns it's start
 *
 * @notice
 * The lazy node at the start of the connection will
 * be evaluated when this function gets executed
 *
 * @param connection The connection to get the start of.
 */
export const getConnectionStart = (connection: SConnection): SOutputPin =>
    connection.node().outputs[connection.index]
