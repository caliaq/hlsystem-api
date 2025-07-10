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
 *         _id:
 *           type: string
 *           description: Unique MongoDB identifier for the product
 *           example: "60d21b4667d0d8992e610c88"
 *         name:
 *           type: string
 *           description: Product name (max 100 characters)
 *           example: "Premium Parking"
 *         price:
 *           type: number
 *           description: Product price
 *           example: 150
 *         description:
 *           type: string
 *           description: Detailed product description (optional, max 500 chars)
 *           example: "Premium parking spot with direct access to the main entrance"
 *         visitor_required:
 *           type: boolean
 *           description: Whether a visitor is required to purchase this product
 *           default: false
 *           example: true
 */
