/**
 * @openapi
 * /visitors:
 *   get:
 *     operationId: getVisitors
 *     summary: Retrieve all visitors
 *     description: |
 *       Fetches a list of all visitor records stored in the system.
 *       Returns all visitor information including names, contact details, and optional vehicle information.
 *       This endpoint is useful for administrative dashboards and reporting functions.
 *     tags: [Visitors]
 *     responses:
 *       200:
 *         description: List of all visitor records successfully retrieved
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
 *                     $ref: '#/components/schemas/Visitor'
 *                   description: Array of visitor records
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 - _id: "60d21b4667d0d8992e610c85"
 *                   firstName: "Anna"
 *                   lastName: "Nováková"
 *                   email: "anna.novakova@example.com"
 *                   phone: "+420776123456"
 *                   licensePlate: "1AB2345"
 *                 - _id: "60d21b4667d0d8992e610c86"
 *                   firstName: "Jan"
 *                   lastName: "Svoboda"
 *                   email: "jan.svoboda@example.com"
 *                   phone: "+420601234567"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
