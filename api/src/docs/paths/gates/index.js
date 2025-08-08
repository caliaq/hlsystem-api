/**
 * @openapi
 * components:
 *   parameters:
 *     gateIdParam:
 *       in: path
 *       name: gateId
 *       schema:
 *         type: string
 *         pattern: '^[A-Z0-9_]{1,20}$'
 *       required: true
 *       description: Unique identifier for the gate (alphanumeric and underscore characters)
 *       example: "GATE_01"
 *   schemas:
 *     Gate:
 *       type: object
 *       description: Gate information and status
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the gate
 *           example: "GATE_01"
 *         status:
 *           type: string
 *           enum: ["opened", "closed", "opening", "closing", "error"]
 *           description: Current status of the gate
 *           example: "closed"
 *         lastAction:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last gate action
 *           example: "2023-06-22T14:30:15.000Z"
 *         location:
 *           type: string
 *           description: Physical location or description of the gate
 *           example: "Main Entrance"
 *       required:
 *         - id
 *         - status
 *       example:
 *         id: "GATE_01"
 *         status: "closed"
 *         lastAction: "2023-06-22T14:30:15.000Z"
 *         location: "Main Entrance"
 */
