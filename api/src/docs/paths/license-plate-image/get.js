/**
 * @openapi
 * /license-plate:
 *   get:
 *     operationId: getLicensePlateImage
 *     summary: Retrieve a license plate image
 *     description: |
 *       Serves a license plate image file by filename. The image is returned as binary data
 *       with appropriate content-type headers. If no filename is provided, returns the latest uploaded image.
 *       Supports various image formats including JPEG, PNG, GIF, and WebP.
 *     tags: [License Plate Image]
 *     parameters:
 *       - $ref: '#/components/parameters/imageFilenameParam'
 *     responses:
 *       200:
 *         description: License plate image file successfully retrieved
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *               description: JPEG image data
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *               description: PNG image data
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *               description: GIF image data
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *               description: WebP image data
 *         headers:
 *           Content-Type:
 *             description: MIME type of the image
 *             schema:
 *               type: string
 *               example: "image/jpeg"
 *           Content-Length:
 *             description: Size of the image in bytes
 *             schema:
 *               type: integer
 *               example: 245760
 *           Cache-Control:
 *             description: Cache control header
 *             schema:
 *               type: string
 *               example: "public, max-age=3600"
 *       400:
 *         description: Invalid filename parameter
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
 *                   example: "Invalid filename format"
 *       404:
 *         description: License plate image not found
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
 *                   example: "License plate image not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
