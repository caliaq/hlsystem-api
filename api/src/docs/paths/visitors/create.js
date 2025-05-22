/**
 * @openapi
 * /visitors:
 *   post:
 *     operationId: createVisitor
 *     summary: Register a new visitor
 *     description: |
 *       Creates a new visitor record in the system with detailed personal information.
 *       All required fields undergo validation:
 *       - Names must contain only alphabetic characters (accented characters supported)
 *       - Email must be in valid format and will be stored in lowercase
 *       - Phone number must be in a valid international format
 *       - License plate is optional but validated if provided
 *     tags: [Visitors]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visitor'
 *           examples:
 *             standardVisitor:
 *               $ref: '#/components/examples/standardVisitor'
 *             minimalVisitor:
 *               $ref: '#/components/examples/minimalVisitor'
 *             internationalVisitor:
 *               $ref: '#/components/examples/internationalVisitor'
 *     responses:
 *       201:
 *         description: Visitor successfully registered and assigned a unique identifier for future reference
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
 *                     visitorId:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                       description: Unique MongoDB identifier for the created visitor that should be stored for subsequent operations
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */