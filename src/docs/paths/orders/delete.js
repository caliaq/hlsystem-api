/**
 * @openapi
 * /orders/{orderId}:
 *   delete:
 *     summary: Remove an order record
 *     description: |
 *       Permanently deletes an order record from the system based on the provided identifier.
 *       This operation cannot be undone, and all order data will be permanently removed.
 *
 *       The deletion process:
 *       - Validates the MongoDB ObjectID format (24 hexadecimal characters)
 *       - Verifies the order record exists in the database
 *       - Permanently removes the record and all associated information
 *       - Returns a success confirmation without the deleted data
 *     tags: [Orders]
 *     parameters:
 *       - $ref: '#/components/parameters/orderIdParam'
 *     responses:
 *       200:
 *         description: Order record successfully deleted from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the deletion was successful
 *               required:
 *                 - success
 *             example:
 *               success: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
