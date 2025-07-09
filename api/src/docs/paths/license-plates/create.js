/**
 * @openapi
 * /license-plates/{text}:
 *   post:
 *     operationId: addLicensePlate
 *     summary: Create a new license plate
 *     description: |
 *       Creates a new license plate record in the system with the specified text.
 *       The license plate text is provided as a URL parameter, and additional data
 *       (such as order reference) should be provided in the request body.
 *     tags: [License Plates]
 *     parameters:
 *       - $ref: '#/components/parameters/licensePlateTextParam'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: string
 *                 description: MongoDB ObjectID reference to an order (optional)
 *                 example: "60d21b4667d0d8992e610c80"
 *           example:
 *             order: "60d21b4667d0d8992e610c80"
 *     responses:
 *       201:
 *         description: License plate record successfully created
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
 *                     licensePlateId:
 *                       type: string
 *                       description: MongoDB ObjectID of the created license plate
 *                       example: "60d21b4667d0d8992e610c85"
 *                   required:
 *                     - licensePlateId
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 licensePlateId: "60d21b4667d0d8992e610c85"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
