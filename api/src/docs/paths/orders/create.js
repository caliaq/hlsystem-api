/**
 *     description: |
       Creates a new order record in the system linking a visitor to one or more products.
       All required fields undergo validation:
       - Visitor ID must be a valid MongoDB ObjectID
       - Products array must contain at least one product with valid ProductID
       - Date must be a valid date
       - Duration (optional) must be a positive number in milliseconds
       - Quantity must be a positive number not exceeding 99i
 * /orders:
 *   post:
 *     operationId: createOrder
 *     summary: Create a new order
 *     description: |
 *       Creates a new order record in the system linking a visitor to a product.
 *       All required fields undergo validation:
 *       - Visitor ID must be a valid MongoDB ObjectID
 *       - Product ID must be a valid MongoDB ObjectID
 *       - Start date must be a valid date
 *       - Duration must be a positive number in milliseconds
 *       - Quantity must be a positive number not exceeding 99
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           examples:
 *             standardOrder:
 *               value:
 *                 visitorId: "60d21b4667d0d8992e610c85"
 *                 products:
 *                   - productId: "60d21b4667d0d8992e610c86"
 *                     quantity: 2
 *                     duration: 3600000
 *                 date: "2025-06-15T10:00:00.000Z"
 *     responses:
 *       201:
 *         description: Order successfully created and assigned a unique identifier
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
 *                     orderId:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c87"
 *                       description: Unique MongoDB identifier for the created order
 *                   required:
 *                     - orderId
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 orderId: "60d21b4667d0d8992e610c87"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
