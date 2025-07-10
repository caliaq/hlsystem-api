/**
 * @openapi
 * /orders/{orderId}:
 *   patch:
 *     summary: Update order information
 *     description: |
 *       Modifies specific fields for an existing order record. This is a partial update operation
 *       that only changes fields included in the request.
 *
 *       Key features:
 *       - Updates only specified fields, keeping others unchanged
 *       - All provided fields undergo the same validation as during creation
 *       - References to visitors and products must be valid MongoDB ObjectIDs
 *     tags: [Orders]
 *     parameters:
 *       - $ref: '#/components/parameters/orderIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitorId:
 *                 type: string
 *                 format: objectId
 *                 description: Updated reference to visitor
 *               products:
 *                 type: array
 *                 description: Updated array of products in the order
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: objectId
 *                       description: Reference to the product
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the product (maximum 99)
 *                       minimum: 1
 *                       maximum: 99
 *                     duration:
 *                       type: number
 *                       description: Duration in milliseconds (optional)
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Updated order date and time
 *           examples:
 *             changeDate:
 *               summary: Update order date and time
 *               value:
 *                 date: "2025-06-16T14:00:00.000Z"
 *             changeProducts:
 *               summary: Update order products
 *               value:
 *                 products:
 *                   - productId: "60d21b4667d0d8992e610c86"
 *                     quantity: 3
 *                     duration: 7200000
 *     responses:
 *       200:
 *         description: Order information successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the update operation was successful
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                   description: The complete updated order record
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
 *                     quantity: 3
 *                     duration: 3600000
 *                 date: "2025-06-16T14:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
