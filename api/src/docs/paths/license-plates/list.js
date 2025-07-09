/**
 * @openapi
 * /license-plates:
 *   get:
 *     operationId: getLicensePlates
 *     summary: Retrieve all license plates
 *     description: |
 *       Fetches a list of all license plate records stored in the system.
 *       Returns all license plate information including text and associated order details.
 *       This endpoint is useful for administrative dashboards and reporting functions.
 *     tags: [License Plates]
 *     responses:
 *       200:
 *         description: List of all license plate records successfully retrieved
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LicensePlate'
 *                   description: Array of license plate records
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 - _id: "60d21b4667d0d8992e610c85"
 *                   text: "1AB2345"
 *                   order:
 *                     _id: "60d21b4667d0d8992e610c80"
 *                     status: "pending"
 *                 - _id: "60d21b4667d0d8992e610c86"
 *                   text: "2CD6789"
 *                   order:
 *                     _id: "60d21b4667d0d8992e610c81"
 *                     status: "completed"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
