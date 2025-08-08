/**
 * @openapi
 * /license-plate:
 *   post:
 *     operationId: uploadLicensePlateImage
 *     summary: Upload a license plate image
 *     description: |
 *       Uploads a license plate image file for processing and recognition.
 *       The file should be sent as multipart/form-data with any field name.
 *       Supported formats include JPEG, PNG, GIF, and WebP. Maximum file size is 10MB.
 *       The uploaded image will be processed for license plate detection and text extraction.
 *     tags: [License Plate Image]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: License plate image file (any field name accepted)
 *                 example: "Binary image data"
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Image uploaded and processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the operation was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message
 *                       example: "License plate image uploaded and processed successfully"
 *                     filename:
 *                       type: string
 *                       description: Generated filename for the uploaded image
 *                       example: "plate-1641234567890-123456789.jpg"
 *                     size:
 *                       type: number
 *                       description: File size in bytes
 *                       example: 245760
 *                     detectedText:
 *                       type: string
 *                       description: License plate text detected from the image (if available)
 *                       example: "1AB2345"
 *                     confidence:
 *                       type: number
 *                       description: Confidence level of text detection (0-1)
 *                       example: 0.95
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Upload timestamp
 *                       example: "2024-01-04T12:30:45.123Z"
 *                     path:
 *                       type: string
 *                       description: URL path to access the uploaded image
 *                       example: "/license-plate?filename=plate-1641234567890-123456789.jpg"
 *                   required:
 *                     - message
 *                     - filename
 *                     - uploadedAt
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 message: "License plate image uploaded and processed successfully"
 *                 filename: "plate-1641234567890-123456789.jpg"
 *                 size: 245760
 *                 detectedText: "1AB2345"
 *                 confidence: 0.95
 *                 uploadedAt: "2024-01-04T12:30:45.123Z"
 *                 path: "/license-plate?filename=plate-1641234567890-123456789.jpg"
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
 *                 message:
 *                   type: string
 *                   example: "No file uploaded or invalid file format"
 *       413:
 *         description: File too large (exceeds 10MB limit)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "File size exceeds maximum limit of 10MB"
 *       422:
 *         description: Unprocessable entity - unable to detect license plate in image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unable to detect license plate in the uploaded image"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
