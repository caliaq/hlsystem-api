/**
 * @openapi
 * /license-plates/{id}:
 *   delete:
 *     operationId: deleteLicensePlate
 *     summary: Delete a license plate
 *     description: |
 *       Deletes a license plate record from the system using the license plate ID.
 *       This permanently removes the license plate from both whitelist and blacklist.
 *       Use with caution as this operation cannot be undone.
 *     tags: [License Plates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         required: true
 *         description: MongoDB ObjectID of the license plate to delete
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       204:
 *         description: License plate successfully deleted (no content returned)
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
 *                   type: null
 *                   example: null
 *                   description: No data returned for successful deletion
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data: null
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: License plate not found
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
 *                   example: "License plate not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
