/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - visitorId
 *         - productId
 *         - startDate
 *         - duration
 *         - quantity
 *       properties:
 *         visitorId:
 *           type: string
 *           format: objectId
 *           description: Reference to the visitor who placed the order
 *           example: "60d21b4667d0d8992e610c85"
 *         productId:
 *           type: string
 *           format: objectId
 *           description: Reference to the purchased product
 *           example: "60d21b4667d0d8992e610c86"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the service or product usage
 *           example: "2025-06-15T10:00:00.000Z"
 *         duration:
 *           type: number
 *           description: Duration in milliseconds
 *           example: 3600000
 *         quantity:
 *           type: number
 *           description: Quantity of the product ordered (maximum 99)
 *           example: 2
 */
