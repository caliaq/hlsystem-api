/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Product name (alphabetic characters only, max 100 chars)
 *           example: "Premium Parking"
 *         price:
 *           type: number
 *           description: Product price
 *           example: 150
 *         description:
 *           type: string
 *           description: Detailed product description (optional, max 500 chars)
 *           example: "Premium parking spot with direct access to the main entrance"
 */
