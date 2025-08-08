/**
 * @openapi
 * /license-plates/whitelist:
 *   get:
 *     operationId: getWhitelistedLicensePlates
 *     summary: Retrieve all whitelisted license plates
 *     description: |
 *       Fetches a list of all whitelisted license plate records stored in the system.
 *       Returns all whitelisted license plate information including text and associated details.
 *       This endpoint is useful for access control and administrative purposes.
 *     tags: [License Plates]
 *     responses:
 *       200:
 *         description: List of all whitelisted license plate records successfully retrieved
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
 *                   description: Array of whitelisted license plate records
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 - _id: "60d21b4667d0d8992e610c85"
 *                   text: "1AB2345"
 *                   status: "whitelisted"
 *                   createdAt: "2021-06-22T19:56:22.000Z"
 *                 - _id: "60d21b4667d0d8992e610c86"
 *                   text: "2CD6789"
 *                   status: "whitelisted"
 *                   createdAt: "2021-06-22T20:15:30.000Z"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /license-plates/blacklist:
 *   get:
 *     operationId: getBlacklistedLicensePlates
 *     summary: Retrieve all blacklisted license plates
 *     description: |
 *       Fetches a list of all blacklisted license plate records stored in the system.
 *       Returns all blacklisted license plate information including text and associated details.
 *       This endpoint is useful for security monitoring and administrative purposes.
 *     tags: [License Plates]
 *     responses:
 *       200:
 *         description: List of all blacklisted license plate records successfully retrieved
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
 *                   description: Array of blacklisted license plate records
 *               required:
 *                 - success
 *                 - data
 *             example:
 *               success: true
 *               data:
 *                 - _id: "60d21b4667d0d8992e610c87"
 *                   text: "3EF9012"
 *                   status: "blacklisted"
 *                   createdAt: "2021-06-22T21:45:15.000Z"
 *                 - _id: "60d21b4667d0d8992e610c88"
 *                   text: "4GH3456"
 *                   status: "blacklisted"
 *                   createdAt: "2021-06-22T22:10:45.000Z"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
