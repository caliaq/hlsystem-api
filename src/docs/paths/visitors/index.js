/**
 * @openapi
 * tags:
 *   - name: Visitors
 *     description: |
 *       All endpoints related to visitor management.
 *       This API allows for creation, retrieval, updating, and deletion of visitor records.
 *
 * components:
 *   parameters:
 *     visitorIdParam:
 *       in: path
 *       name: visitorId
 *       schema:
 *         type: string
 *       required: true
 *       description: MongoDB ObjectID of the visitor record (24 hexadecimal characters)
 *       example: "60d21b4667d0d8992e610c85"
 */