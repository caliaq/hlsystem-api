/**
 * @openapi
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique MongoDB identifier for the visitor
 *           example: "60d21b4667d0d8992e610c85"
 *         firstName:
 *           type: string
 *           description: Visitor's first name (alphabetic characters only)
 *           example: "Anna"
 *         lastName:
 *           type: string
 *           description: Visitor's last name (alphabetic characters only)
 *           example: "Nováková"
 *         email:
 *           type: string
 *           format: email
 *           description: Visitor's email address (stored in lowercase)
 *           example: "anna.novakova@example.com"
 *         phone:
 *           type: string
 *           description: Visitor's phone number in international format
 *           example: "+420776123456"
 *         licensePlate:
 *           type: string
 *           description: Visitor's vehicle license plate (optional)
 *           example: "1AB2345"
 */
