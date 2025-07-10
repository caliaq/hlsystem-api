/**
 * @openapi
 * /products/{productId}:
 *   delete:
 *     summary: Remove a product record
 *     description: |
 *       Permanently deletes a product record from the system based on the provided identifier.
 *       This operation cannot be undone, and all product data will be permanently removed.
 *
 *       The deletion process:
 *       - Validates the MongoDB ObjectID format (24 hexadecimal characters)
 *       - Verifies the product record exists in the database
 *       - Permanently removes the record and all associated information
 *       - Returns a success confirmation without the deleted data
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     responses:
 *       200:
 *         description: Product record successfully deleted from the database
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
