/**
 * @openapi
 * /products:
 *   get:
 *     operationId: getProducts
 *     summary: Retrieve all products
 *     description: |
 *       Fetches a list of all product records stored in the system.
 *       Returns comprehensive product information including names, prices, and descriptions.
 *       This endpoint is useful for displaying product catalogs, pricing information,
 *       and for administrative management of the product inventory.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all product records successfully retrieved
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
 *                     $ref: '#/components/schemas/Product'
 *                   description: Array of product records
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 - _id: "60d21b4667d0d8992e610c88"
 *                   name: "Premium Parking"
 *                   price: 150
 *                   description: "Premium parking spot with direct access to the main entrance"
 *                 - _id: "60d21b4667d0d8992e610c89"
 *                   name: "Standard Parking"
 *                   price: 100
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
