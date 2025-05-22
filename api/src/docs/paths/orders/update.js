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
 *               productId:
 *                 type: string
 *                 format: objectId
 *                 description: Updated reference to product
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Updated start date and time
 *               duration:
 *                 type: number
 *                 description: Updated duration in milliseconds
 *               quantity:
 *                 type: number
 *                 description: Updated quantity (maximum 99)
 *           examples:
 *             changeDate:
 *               summary: Update order date and time
 *               value:
 *                 startDate: "2025-06-16T14:00:00.000Z"
 *             changeQuantity:
 *               summary: Update order quantity
 *               value:
 *                 quantity: 3
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
 *                 productId: "60d21b4667d0d8992e610c86"
 *                 startDate: "2025-06-16T14:00:00.000Z"
 *                 duration: 3600000
 *                 quantity: 3
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
