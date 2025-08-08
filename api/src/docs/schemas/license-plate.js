/**
 * @openapi
 * components:
 *   schemas:
 *     LicensePlate:
 *       type: object
 *       required:
 *         - text
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique MongoDB identifier for the license plate
 *           example: "60d21b4667d0d8992e610c85"
 *         text:
 *           type: string
 *           description: License plate text/number (alphanumeric characters)
 *           pattern: '^[A-Z0-9]{1,10}$'
 *           example: "1AB2345"
 *         status:
 *           type: string
 *           enum: ["whitelisted", "blacklisted"]
 *           description: Status of the license plate for access control
 *           example: "whitelisted"
 *         order:
 *           type: string
 *           description: MongoDB ObjectID reference to the associated order (optional)
 *           example: "60d21b4667d0d8992e610c80"
 *         notes:
 *           type: string
 *           description: Additional notes about the license plate
 *           example: "VIP guest vehicle"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the license plate was created
 *           example: "2021-06-22T19:56:22.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the license plate was last updated
 *           example: "2021-06-22T19:56:22.000Z"
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         text: "1AB2345"
 *         status: "whitelisted"
 *         order: "60d21b4667d0d8992e610c80"
 *         notes: "VIP guest vehicle"
 *         createdAt: "2021-06-22T19:56:22.000Z"
 *         updatedAt: "2021-06-22T19:56:22.000Z"
 */
