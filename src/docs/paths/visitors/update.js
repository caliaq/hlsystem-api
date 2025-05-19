/**
 * @openapi
 * /visitors/{visitorId}:
 *   patch:
 *     summary: Update visitor information
 *     description: |
 *       Modifies specific fields for an existing visitor record. This is a partial update operation
 *       that only changes fields included in the request.
 *
 *       Key features:
 *       - Updates only specified fields, keeping others unchanged
 *       - All provided fields undergo the same validation as during creation
 *       - Email addresses are normalized to lowercase
 *       - Input strings are trimmed of whitespace
 *       - Returns the complete updated visitor record after modification
 *     tags: [Visitors]
 *     parameters:
 *       - $ref: '#/components/parameters/visitorIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Updated first name (alphabetic characters only, accented characters supported)
 *               lastName:
 *                 type: string
 *                 description: Updated last name (alphabetic characters only, accented characters supported)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Updated email address (will be validated and stored in lowercase)
 *               phone:
 *                 type: string
 *                 description: Updated phone number (must follow international mobile phone format)
 *               licensePlate:
 *                 type: string
 *                 description: Updated license plate number (optional, validated if provided)
 *           examples:
 *             contactUpdate:
 *               summary: Update contact information
 *               value:
 *                 email: "anna.marie@example.com"
 *                 phone: "+420777987654"
 *             nameChange:
 *               summary: Update name after marriage
 *               value:
 *                 firstName: "Anna Marie"
 *                 lastName: "Svobodová"
 *             vehicleChange:
 *               summary: Update license plate only
 *               value:
 *                 licensePlate: "2CD6789"
 *             removeVehicle:
 *               summary: Remove license plate (set to empty string)
 *               value:
 *                 licensePlate: ""
 *     responses:
 *       200:
 *         description: Visitor information successfully updated with the provided fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the update operation was successful
 *                 data:
 *                   $ref: '#/components/schemas/Visitor'
 *             examples:
 *               updatedContact:
 *                 summary: After contact information update
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "60d21b4667d0d8992e610c85"
 *                     firstName: "Anna"
 *                     lastName: "Nováková"
 *                     email: "anna.marie@example.com"
 *                     phone: "+420777987654"
 *                     licensePlate: "1AB2345"
 *               updatedName:
 *                 summary: After name change
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "60d21b4667d0d8992e610c85"
 *                     firstName: "Anna Marie"
 *                     lastName: "Svobodová"
 *                     email: "anna.novakova@example.com"
 *                     phone: "+420776123456"
 *                     licensePlate: "1AB2345"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
