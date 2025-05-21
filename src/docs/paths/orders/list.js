/**
 * @openapi
 * /orders:
 *   get:
 *     operationId: getOrders
 *     summary: Retrieve all orders
 *     description: |
 *       Fetches a list of all order records stored in the system.
 *       Returns comprehensive order information including visitor and product associations,
 *       timing details, quantities, and other relevant data.
 *       This endpoint is useful for reporting, financial analysis, and administrative oversight.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all order records successfully retrieved
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                   description: Array of order records
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 - _id: "60d21b4667d0d8992e610c87"
 *                   visitorId: "60d21b4667d0d8992e610c85"
 *                   productId: "60d21b4667d0d8992e610c88"
 *                   startDate: "2025-06-15T10:00:00.000Z"
 *                   duration: 3600000
 *                   quantity: 2
 *                 - _id: "60d21b4667d0d8992e610c89"
 *                   visitorId: "60d21b4667d0d8992e610c86"
 *                   productId: "60d21b4667d0d8992e610c88"
 *                   startDate: "2025-06-16T14:00:00.000Z"
 *                   duration: 7200000
 *                   quantity: 1
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
