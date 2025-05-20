/**
 * @openapi
 * /products/{productId}:
 *   get:
 *     summary: Retrieve product details
 *     description: |
 *       Fetches comprehensive information about a specific product using its unique identifier.
 *       The endpoint performs ID validation to ensure proper MongoDB ObjectID format before retrieving data.
 *       Returns all product fields including optional ones if they were provided during creation.
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     responses:
 *       200:
 *         description: Product information successfully retrieved
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
 *                   $ref: '#/components/schemas/Product'
 *             examples:
 *               completeProduct:
 *                 summary: Product with description
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "60d21b4667d0d8992e610c88"
 *                     name: "Premium Parking"
 *                     price: 150
 *                     description: "Premium parking spot with direct access to the main entrance"
 *               basicProduct:
 *                 summary: Product without description
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "60d21b4667d0d8992e610c89"
 *                     name: "Standard Parking"
 *                     price: 100
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
