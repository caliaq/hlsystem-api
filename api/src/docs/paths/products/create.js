/**
 *     description: |
       Creates a new product record in the system.
       All required fields undergo validation:
       - Name must be at most 100 characters
       - Price must be a valid number
       - Description is optional but limited to 500 characters if provided
       - visitor_required is optional and defaults to falseapi
 * /products:
 *   post:
 *     operationId: createProduct
 *     summary: Create a new product
 *     description: |
 *       Creates a new product record in the system.
 *       All required fields undergo validation:
 *       - Name must contain only alphabetic characters and be at most 100 characters
 *       - Price must be a valid number
 *       - Description is optional but limited to 500 characters if provided
 *     tags: [Products]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           examples:
 *             standardProduct:
 *               value:
 *                 name: "Premium Parking"
 *                 price: 150
 *                 description: "Premium parking spot with direct access to the main entrance"
 *                 visitor_required: true
 *             basicProduct:
 *               value:
 *                 name: "Standard Parking"
 *                 price: 100
 *                 visitor_required: false
 *     responses:
 *       201:
 *         description: Product successfully created and assigned a unique identifier
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
 *                     productId:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c88"
 *                       description: Unique MongoDB identifier for the created product
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
