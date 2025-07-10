/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: |
 *       All endpoints related to order management.
 *       This API allows for creation, retrieval, updating, and deletion of order records.
 *
 *       Orders represent bookings or purchases made by visitors and link to specific products.
 *       Each order tracks important details like timing, duration, and quantity.
 *
 * components:
 *   parameters:
 *     orderIdParam:
 *       in: path
 *       name: orderId
 *       schema:
 *         type: string
 *       required: true
 *       description: MongoDB ObjectID of the order record (24 hexadecimal characters)
 *       example: "60d21b4667d0d8992e610c87"
 */
