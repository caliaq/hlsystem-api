/**
 * @openapi
 * tags:
 *   - name: License Plate Images
 *     description: |
 *       Endpoints for uploading and serving license plate images.
 *       Allows uploading license plate photos and retrieving them by filename.
 *
 * components:
 *   parameters:
 *     imageFilenameParam:
 *       in: path
 *       name: filename
 *       schema:
 *         type: string
 *       required: true
 *       description: The filename of the license plate image
 *       example: "plate-1641234567890-123456789.jpg"
 */
