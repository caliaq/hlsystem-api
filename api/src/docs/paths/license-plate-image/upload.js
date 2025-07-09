/**
 * @openapi
 * /license-plate:
 *   post:
 *     operationId: uploadLicensePlateImage
 *     summary: Upload a license plate image
 *     description: |
 *       Uploads a license plate image file that replaces the current plate.jpg file.
 *       The file should be sent as multipart/form-data with the field name 'plate.jpg'.
 *       This endpoint always overwrites the existing license plate image.
 *       Supported formats include JPEG, PNG, GIF, and WebP. Maximum file size is 10MB.
 *     tags: [License Plate Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               plate.jpg:
 *                 type: string
 *                 format: binary
 *                 description: License plate image file
 *             required:
 *               - plate.jpg
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message
 *                       example: "License plate image updated successfully"
 *                     filename:
 *                       type: string
 *                       description: The filename (always plate.jpg)
 *                       example: "plate.jpg"
 *                     size:
 *                       type: number
 *                       description: File size in bytes
 *                       example: 245760
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the image was updated
 *                       example: "2023-01-04T10:30:00.000Z"
 *                     path:
 *                       type: string
 *                       description: URL path to access the uploaded image
 *                       example: "/license-plate/plate-1641234567890-123456789.jpg"
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Upload timestamp
 *                       example: "2024-01-04T12:30:45.123Z"
 *       400:
 *         description: Bad request - no file uploaded or invalid file format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No file uploaded. Please upload a file named 'plate.jpg'"
 *       413:
 *         description: File too large (exceeds 10MB limit)
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
