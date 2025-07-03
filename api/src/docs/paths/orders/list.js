/**
 * @openapi
 * /orders:
 *   get:
 *     operationId: getOrders
 *     summary: Retrieve all orders
 *     description: Fetches a list of all order records stored in the system
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
