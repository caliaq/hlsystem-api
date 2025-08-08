/**
 * @openapi
 * /gates/{gateId}/opening:
 *   post:
 *     operationId: setGateOpening
 *     summary: Set gate to opening state
 *     description: |
 *       Initiates the gate opening process and sets the gate status to "opening".
 *       This endpoint is typically used to signal that the gate has started the opening sequence.
 *     tags: [Gates]
 *     parameters:
 *       - $ref: '#/components/parameters/gateIdParam'
 *     responses:
 *       200:
 *         description: Gate opening state successfully set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the operation was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "opening"
 *                       description: Current gate status
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-22T14:30:15.000Z"
 *                       description: When the status was set
 *                   required:
 *                     - status
 *                     - timestamp
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 status: "opening"
 *                 timestamp: "2023-06-22T14:30:15.000Z"
 *       404:
 *         description: Gate not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /gates/{gateId}/closing:
 *   post:
 *     operationId: setGateClosing
 *     summary: Set gate to closing state
 *     description: |
 *       Initiates the gate closing process and sets the gate status to "closing".
 *       This endpoint is typically used to signal that the gate has started the closing sequence.
 *     tags: [Gates]
 *     parameters:
 *       - $ref: '#/components/parameters/gateIdParam'
 *     responses:
 *       200:
 *         description: Gate closing state successfully set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the operation was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "closing"
 *                       description: Current gate status
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-22T14:30:15.000Z"
 *                       description: When the status was set
 *                   required:
 *                     - status
 *                     - timestamp
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 status: "closing"
 *                 timestamp: "2023-06-22T14:30:15.000Z"
 *       404:
 *         description: Gate not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /gates/{gateId}/opened:
 *   post:
 *     operationId: setGateOpened
 *     summary: Set gate to opened state
 *     description: |
 *       Sets the gate status to "opened", indicating that the gate has completed the opening process
 *       and is now fully open. This endpoint is typically called when the gate opening sequence is complete.
 *     tags: [Gates]
 *     parameters:
 *       - $ref: '#/components/parameters/gateIdParam'
 *     responses:
 *       200:
 *         description: Gate opened state successfully set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the operation was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "opened"
 *                       description: Current gate status
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-22T14:30:15.000Z"
 *                       description: When the status was set
 *                   required:
 *                     - status
 *                     - timestamp
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 status: "opened"
 *                 timestamp: "2023-06-22T14:30:15.000Z"
 *       404:
 *         description: Gate not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /gates/{gateId}/closed:
 *   post:
 *     operationId: setGateClosed
 *     summary: Set gate to closed state
 *     description: |
 *       Sets the gate status to "closed", indicating that the gate has completed the closing process
 *       and is now fully closed. This endpoint is typically called when the gate closing sequence is complete.
 *     tags: [Gates]
 *     parameters:
 *       - $ref: '#/components/parameters/gateIdParam'
 *     responses:
 *       200:
 *         description: Gate closed state successfully set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the operation was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "closed"
 *                       description: Current gate status
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-22T14:30:15.000Z"
 *                       description: When the status was set
 *                   required:
 *                     - status
 *                     - timestamp
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 status: "closed"
 *                 timestamp: "2023-06-22T14:30:15.000Z"
 *       404:
 *         description: Gate not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
