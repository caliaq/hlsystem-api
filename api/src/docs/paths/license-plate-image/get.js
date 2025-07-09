/**
 * @openapi
 * /license-plate:
 *   get:
 *     operationId: getLicensePlateImage
 *     summary: Retrieve the current license plate image
 *     description: |
 *       Serves the current license plate image file (plate.jpg). The image is returned as binary data
 *       with appropriate content-type headers. This endpoint always returns the latest uploaded image.
 *     tags: [License Plate Images]
 *     responses:
 *       200:
 *         description: Current license plate image file
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No license plate image found
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
 *                   example: "No license plate image found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
