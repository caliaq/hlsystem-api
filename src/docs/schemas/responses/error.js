/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *           description: Always false for error responses
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Detailed error message
 *             timestamp:
 *               type: string
 *               format: date-time
 *               description: Time when the error occurred
 *             path:
 *               type: string
 *               description: API endpoint path
 *             method:
 *               type: string
 *               description: HTTP method used
 *             code:
 *               type: string
 *               description: HTTP status code description
 *
 *   responses:
 *     BadRequest:
 *       description: Invalid input data - one or more fields failed validation checks
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           examples:
 *             invalidEmail:
 *               summary: Email validation error
 *               value:
 *                 success: false
 *                 data:
 *                   message: "EMAIL:invalid-email is invalid"
 *                   timestamp: "2025-05-19T09:23:45.678Z"
 *                   path: "/visitors"
 *                   method: "POST"
 *                   code: "Bad Request"
 *             invalidName:
 *               summary: Name validation error
 *               value:
 *                 success: false
 *                 data:
 *                   message: "FIRSTNAME:John123 is invalid"
 *                   timestamp: "2025-05-19T09:25:12.345Z"
 *                   path: "/visitors"
 *                   method: "POST"
 *                   code: "Bad Request"
 *     ServerError:
 *       description: Server error occurred while processing the request
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             data:
 *               message: "Something went wrong"
 *               timestamp: "2025-05-19T09:24:12.345Z"
 *               path: "/visitors"
 *               method: "POST"
 *               code: "Internal Server Error"
 *     NotFound:
 *       description: Requested resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             data:
 *               message: "VISITOR:60d21b4667d0d8992e610c86 is invalid"
 *               timestamp: "2025-05-19T10:16:45.789Z"
 *               path: "/visitors/60d21b4667d0d8992e610c86"
 *               method: "GET"
 *               code: "Not Found"
 */
