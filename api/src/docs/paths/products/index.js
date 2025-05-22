/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: |
 *       All endpoints related to product management.
 *       This API allows for creation, retrieval, updating, and deletion of product records.
 *
 *       Products represent services or items available for purchase or reservation by visitors.
 *       Each product includes details like name, price, and an optional description.
 *
 * components:
 *   parameters:
 *     productIdParam:
 *       in: path
 *       name: productId
 *       schema:
 *         type: string
 *       required: true
 *       description: MongoDB ObjectID of the product record (24 hexadecimal characters)
 *       example: "60d21b4667d0d8992e610c88"
 */
