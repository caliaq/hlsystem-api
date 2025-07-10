/**
 * @openapi
 * components:
 *   schemas:
 *     LicensePlate:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique MongoDB identifier for the license plate
 *           example: "60d21b4667d0d8992e610c85"
 *         text:
 *           type: string
 *           description: License plate text/number
 *           example: "1AB2345"
 *         order:
 *           type: string
 *           description: MongoDB ObjectID reference to the associated order (optional)
 *           example: "60d21b4667d0d8992e610c80"
 */
