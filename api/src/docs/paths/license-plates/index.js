/**
 * @openapi
 * tags:
 *   - name: License Plates
 *     description: |
 *       All endpoints related to license plate management.
 *       This API allows for creation and retrieval of license plate records associated with orders.
 *
 * components:
 *   parameters:
 *     licensePlateTextParam:
 *       in: path
 *       name: text
 *       schema:
 *         type: string
 *       required: true
 *       description: License plate text/number
 *       example: "1AB2345"
 */
