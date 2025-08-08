/**
 * @openapi
 * /gates/{gateId}:
 *   get:
 *     operationId: getGate
 *     summary: Retrieve gate information
 *     description: |
 *       Fetches detailed information about a specific gate including its current status,
 *       last action timestamp, and location information.
 *     tags: [Gates]
 *     parameters:
 *       - $ref: '#/components/parameters/gateIdParam'
 *     responses:
 *       200:
 *         description: Gate information successfully retrieved
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
 *                   $ref: '#/components/schemas/Gate'
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 id: "GATE_01"
 *                 status: "closed"
 *                 lastAction: "2023-06-22T14:30:15.000Z"
 *                 location: "Main Entrance"
 *       404:
 *         description: Gate not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Gate not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /gates/{gateId}/status:
 *   get:
 *     operationId: getGateStatus
 *     summary: Retrieve gate status
 *     description: |
 *       Fetches the current status of a specific gate. This is a lightweight endpoint
 *       that returns only the gate's current operational status.
 *     tags: [Gates]
 *     parameters:
 *       - $ref: '#/components/parameters/gateIdParam'
 *     responses:
 *       200:
 *         description: Gate status successfully retrieved
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
 *                       enum: ["opened", "closed", "opening", "closing", "error"]
 *                       description: Current status of the gate
 *                       example: "closed"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when status was last updated
 *                       example: "2023-06-22T14:30:15.000Z"
 *                   required:
 *                     - status
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Gate not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /gates/{gateId}/toggle:
 *   get:
 *     operationId: toggleGate
 *     summary: Toggle gate state
 *     description: |
 *       Toggles the gate between open and closed states. If the gate is currently closed,
 *       it will be opened. If it's currently opened, it will be closed. This is a convenience
 *       endpoint for simple gate control operations.
 *     tags: [Gates]
 *     parameters:
 *       - $ref: '#/components/parameters/gateIdParam'
 *     responses:
 *       200:
 *         description: Gate toggle command successfully executed
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
 *                     action:
 *                       type: string
 *                       enum: ["opening", "closing"]
 *                       description: The action that was initiated
 *                       example: "opening"
 *                     previousStatus:
 *                       type: string
 *                       enum: ["opened", "closed"]
 *                       description: The status before toggle
 *                       example: "closed"
 *                     newStatus:
 *                       type: string
 *                       enum: ["opening", "closing"]
 *                       description: The new status after toggle
 *                       example: "opening"
 *                   required:
 *                     - action
 *                     - newStatus
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 action: "opening"
 *                 previousStatus: "closed"
 *                 newStatus: "opening"
 *       404:
 *         description: Gate not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Gate not found"
 *       409:
 *         description: Gate is in transitional state and cannot be toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Gate is currently in transition state"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
