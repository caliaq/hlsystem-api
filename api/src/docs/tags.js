/**
 * @openapi
 * tags:
 *   - name: Visitors
 *     description: |
 *       All endpoints related to visitor management.
 *       This API allows for creation, retrieval, updating, and deletion of visitor records.
 *
 *       Visitors can be registered, managed, and tracked through this API with detailed validation
 *       for all personal information fields including names, contact information, and vehicle details.
 *   - name: Products
 *     description: |
 *       All endpoints related to product management.
 *       This API allows for creation, retrieval, updating, and deletion of product records.
 *
 *       Products represent services or items that can be ordered by visitors, with pricing and description information.
 *   - name: Orders
 *     description: |
 *       All endpoints related to order management.
 *       This API allows for creation, retrieval, updating, and deletion of order records.
 *
 *       Orders represent purchases made by visitors for specific products, including quantity, date, and duration information.
 *   - name: License Plates
 *     description: |
 *       All endpoints related to license plate management.
 *       This API allows for creation and retrieval of license plate records with whitelist and blacklist functionality.
 *
 *       License plates can be managed for access control and tracking purposes with support for both whitelisted and blacklisted plates.
 *   - name: License Plate Image
 *     description: |
 *       All endpoints related to license plate image upload and retrieval.
 *       This API allows for uploading license plate images and retrieving them for processing.
 *
 *       Images are processed for license plate recognition and stored for tracking and verification purposes.
 *   - name: Gates
 *     description: |
 *       All endpoints related to gate control and monitoring.
 *       This API allows for controlling gate operations including opening, closing, and status monitoring.
 *
 *       Gates can be controlled remotely and their status can be monitored in real-time for access control systems.
 */
