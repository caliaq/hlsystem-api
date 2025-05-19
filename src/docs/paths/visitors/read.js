/**
 * @openapi
 * /visitors/{visitorId}:
 *   get:
 *     summary: Retrieve visitor details
 *     description: |
 *       Fetches comprehensive information about a specific visitor using their unique identifier.
 *       The endpoint performs ID validation to ensure proper MongoDB ObjectID format before retrieving data.
 *       Returns all visitor fields including optional ones if they were provided during registration.
 *     tags: [Visitors]
 *     parameters:
 *       - $ref: '#/components/parameters/visitorIdParam'
 *     responses:
 *       200:
 *         description: Visitor information successfully retrieved with all stored fields
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
 *                   $ref: '#/components/schemas/Visitor'
 *             examples:
 *               standardVisitor:
 *                 summary: Complete visitor record
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "60d21b4667d0d8992e610c85"
 *                     firstName: "Anna"
 *                     lastName: "Nováková"
 *                     email: "anna.novakova@example.com"
 *                     phone: "+420776123456"
 *                     licensePlate: "1AB2345"
 *               visitorWithoutLicensePlate:
 *                 summary: Visitor without optional fields
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "60d21b4667d0d8992e610c86"
 *                     firstName: "Jan"
 *                     lastName: "Svoboda"
 *                     email: "jan.svoboda@example.com"
 *                     phone: "+420601234567"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */