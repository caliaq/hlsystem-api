/**
 * @openapi
 * components:
 *   parameters:
 *     licensePlateTextParam:
 *       in: path
 *       name: text
 *       schema:
 *         type: string
 *         pattern: '^[A-Z0-9]{1,10}$'
 *       required: true
 *       description: License plate text/number (alphanumeric characters only)
 *       example: "1AB2345"
 */
