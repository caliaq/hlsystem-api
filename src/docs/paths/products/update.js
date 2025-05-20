/**
 * @openapi
 * /products/{productId}:
 *   patch:
 *     summary: Update product information
 *     description: |
 *       Modifies specific fields for an existing product record. This is a partial update operation
 *       that only changes fields included in the request.
 *
 *       Key features:
 *       - Updates only specified fields, keeping others unchanged
 *       - All provided fields undergo the same validation as during creation
 *       - Input strings are trimmed of whitespace
 *       - Returns the complete updated product record after modification
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated product name (alphabetic characters only, max 100 chars)
 *               price:
 *                 type: number
 *                 description: Updated product price
 *               description:
 *                 type: string
 *                 description: Updated product description (optional, max 500 chars)
 *           examples:
 *             priceUpdate:
 *               summary: Update product price
 *               value:
 *                 price: 175
 *             descriptionUpdate:
 *               summary: Update product description
 *               value:
 *                 description: "Premium parking with security service and direct access to venue"
 *             removeDescription:
 *               summary: Remove description (set to empty string)
 *               value:
 *                 description: ""
 *     responses:
 *       200:
 *         description: Product information successfully updated
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
 *                   $ref: '#/components/schemas/Product'
 *             example:
 *               success: true
 *               data:
 *                 _id: "60d21b4667d0d8992e610c88"
 *                 name: "Premium Parking"
 *                 price: 175
 *                 description: "Premium parking with security service and direct access to venue"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
