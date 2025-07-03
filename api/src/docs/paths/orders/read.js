/**
 * @openapi
 * /orders/{orderId}:
 *   get:
 *     summary: Retrieve order details
 *     description: |
 *       Fetches comprehensive information about a specific order using its unique identifier.
 *       The endpoint performs ID validation to ensure proper MongoDB ObjectID format before retrieving data.
 *       Returns all order fields with references to the visitor and product.
 *     tags: [Orders]
 *     parameters:
 *       - $ref: '#/components/parameters/orderIdParam'
 *     responses:
 *       200:
 *         description: Order information successfully retrieved
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
 *                   $ref: '#/components/schemas/Order'
 *                   description: The complete order record
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 _id: "60d21b4667d0d8992e610c87"
 *                 visitorId: "60d21b4667d0d8992e610c85"
 *                 products:
 *                   - productId: "60d21b4667d0d8992e610c86"
 *                     quantity: 2
 *                     duration: 3600000
 *                 date: "2025-06-15T10:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
