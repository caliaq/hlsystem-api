/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - visitorId
 *         - products
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique MongoDB identifier for the order
 *           example: "60d21b4667d0d8992e610c87"
 *         visitorId:
 *           type: string
 *           format: objectId
 *           description: Reference to the visitor who placed the order
 *           example: "60d21b4667d0d8992e610c85"
 *         products:
 *           type: array
 *           description: Array of products in the order
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: objectId
 *                 description: Reference to the purchased product
 *                 example: "60d21b4667d0d8992e610c86"
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product ordered (maximum 99)
 *                 minimum: 1
 *                 maximum: 99
 *                 example: 2
 *               duration:
 *                 type: number
 *                 description: Duration in milliseconds (optional)
 *                 example: 3600000
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was placed
 *           example: "2025-06-15T10:00:00.000Z"
 */
