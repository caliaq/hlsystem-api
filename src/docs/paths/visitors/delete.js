/**
 * @openapi
 * /visitors/{visitorId}:
 *   delete:
 *     summary: Remove a visitor record
 *     description: |
 *       Permanently deletes a visitor record from the system based on the provided identifier.
 *       This operation cannot be undone, and all visitor data will be permanently removed.
 *
 *       The deletion process:
 *       - Validates the MongoDB ObjectID format (24 hexadecimal characters)
 *       - Verifies the visitor record exists in the database
 *       - Permanently removes the record and all associated information
 *       - Returns a success confirmation without the deleted data
 *     tags: [Visitors]
 *     parameters:
 *       - $ref: '#/components/parameters/visitorIdParam'
 *     responses:
 *       200:
 *         description: Visitor record successfully deleted from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates the deletion was successful
 *             example:
 *               success: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */