/**
 * @openapi
 * components:
 *   parameters:
 *     imageFilenameParam:
 *       in: query
 *       name: filename
 *       schema:
 *         type: string
 *         pattern: '^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif)$'
 *       required: true
 *       description: The filename of the license plate image to retrieve
 *       example: "plate-1641234567890-123456789.jpg"
 */
