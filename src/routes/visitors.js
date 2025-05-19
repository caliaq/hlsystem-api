// imports
import { Router } from "express";
import Controller from "#controllers/visitors";

/**
 * @swagger
 * tags:
 *   name: Visitors
 *   description: Comprehensive API endpoints for visitor management in the facility access system. These endpoints handle the complete lifecycle of visitor records, including registration, information retrieval, profile updates, and record deletion. Proper validation is applied to all data fields to ensure data integrity.
 */

/**
 * @swagger
 * /visitors:
 *   post:
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visitor'
 *           examples:
 *             standardVisitor:
 *               summary: Standard visitor with all fields
 *               value:
 *                 firstName: "Anna"
 *                 lastName: "Nováková"
 *                 email: "anna.novakova@example.com"
 *                 phone: "+420776123456"
 *                 licensePlate: "1AB2345"
 *             minimalVisitor:
 *               summary: Minimal visitor without optional fields
 *               value:
 *                 firstName: "Jan"
 *                 lastName: "Svoboda"
 *                 email: "jan.svoboda@example.com"
 *                 phone: "+420601234567"
 *             internationalVisitor:
 *               summary: International visitor with different phone format
 *               value:
 *                 firstName: "Thomas"
 *                 lastName: "Schmidt"
 *                 email: "thomas.schmidt@example.de"
 *                 phone: "+49170123456"
 *                 licensePlate: "M-AB-1234"
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
 *         description: Invalid input data - one or more fields failed validation checks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidEmail:
 *                 summary: Email validation error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "EMAIL:invalid-email is invalid"
 *                     timestamp: "2025-05-19T09:23:45.678Z"
 *                     path: "/visitors"
 *                     method: "POST"
 *                     code: "Bad Request"
 *               invalidName:
 *                 summary: Name validation error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "FIRSTNAME:John123 is invalid"
 *                     timestamp: "2025-05-19T09:25:12.345Z"
 *                     path: "/visitors"
 *                     method: "POST"
 *                     code: "Bad Request"
 *               invalidPhone:
 *                 summary: Phone validation error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "PHONE:123 is invalid"
 *                     timestamp: "2025-05-19T09:26:33.789Z"
 *                     path: "/visitors"
 *                     method: "POST"
 *                     code: "Bad Request"
 *       500:
 *         description: Server error occurred while processing the request, possibly due to database connection issues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data:
 *                 message: "Something went wrong"
 *                 timestamp: "2025-05-19T09:24:12.345Z"
 *                 path: "/visitors"
 *                 method: "POST"
 *                 code: "Internal Server Error"
 */

/**
 * @swagger
 * /visitors/{visitorId}:
 *   get:
 *     summary: Retrieve visitor details
 *     description: |
 *       Fetches comprehensive information about a specific visitor using their unique identifier.
 *       The endpoint performs ID validation to ensure proper MongoDB ObjectID format before retrieving data.
 *       Returns all visitor fields including optional ones if they were provided during registration.
 *     tags: [Visitors]
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectID of the visitor record (24 hexadecimal characters)
 *         example: "60d21b4667d0d8992e610c85"
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
 *         description: Invalid ID format - the provided ID is not a valid 24-character MongoDB ObjectID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidFormat:
 *                 summary: Non-hexadecimal ID error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "ID:invalid-id is invalid"
 *                     timestamp: "2025-05-19T10:15:30.123Z"
 *                     path: "/visitors/invalid-id"
 *                     method: "GET"
 *                     code: "Bad Request"
 *               shortId:
 *                 summary: ID length error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "ID:abc123 is invalid"
 *                     timestamp: "2025-05-19T10:16:10.456Z"
 *                     path: "/visitors/abc123"
 *                     method: "GET"
 *                     code: "Bad Request"
 *       404:
 *         description: Visitor not found - no record exists with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data:
 *                 message: "VISITOR:60d21b4667d0d8992e610c86 is invalid"
 *                 timestamp: "2025-05-19T10:16:45.789Z"
 *                 path: "/visitors/60d21b4667d0d8992e610c86"
 *                 method: "GET"
 *                 code: "Not Found"
 *       500:
 *         description: Server error occurred while retrieving the visitor information, possibly due to database connectivity issues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data:
 *                 message: "Something went wrong"
 *                 timestamp: "2025-05-19T10:18:20.987Z"
 *                 path: "/visitors/60d21b4667d0d8992e610c85"
 *                 method: "GET"
 *                 code: "Internal Server Error"
 *
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
 *       - in: path
 *         name: visitorId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectID of the visitor to update (24 hexadecimal characters)
 *         example: "60d21b4667d0d8992e610c85"
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
 *         description: Invalid input data or ID format - data validation failed or ID is malformed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidEmail:
 *                 summary: Email validation error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "EMAIL:invalid-email is invalid"
 *                     timestamp: "2025-05-19T11:22:33.456Z"
 *                     path: "/visitors/60d21b4667d0d8992e610c85"
 *                     method: "PATCH"
 *                     code: "Bad Request"
 *               invalidPhone:
 *                 summary: Phone validation error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "PHONE:12345 is invalid"
 *                     timestamp: "2025-05-19T11:23:45.678Z"
 *                     path: "/visitors/60d21b4667d0d8992e610c85"
 *                     method: "PATCH"
 *                     code: "Bad Request"
 *               invalidId:
 *                 summary: ID format error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "ID:invalid-id is invalid"
 *                     timestamp: "2025-05-19T11:24:56.789Z"
 *                     path: "/visitors/invalid-id"
 *                     method: "PATCH"
 *                     code: "Bad Request"
 *       404:
 *         description: Visitor not found - no record exists with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data:
 *                 message: "VISITOR:60d21b4667d0d8992e610c86 is invalid"
 *                 timestamp: "2025-05-19T11:25:12.345Z"
 *                 path: "/visitors/60d21b4667d0d8992e610c86"
 *                 method: "PATCH"
 *                 code: "Not Found"
 *       500:
 *         description: Server error occurred while updating the visitor information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data:
 *                 message: "Something went wrong"
 *                 timestamp: "2025-05-19T11:26:54.321Z"
 *                 path: "/visitors/60d21b4667d0d8992e610c85"
 *                 method: "PATCH"
 *                 code: "Internal Server Error"
 *
 *   delete:
 *     summary: Remove a visitor record
 *     description: |
 *       Permanently deletes a visitor record from the system based on the provided identifier.
 *       This operation cannot be undone, and all visitor data will be permanently removed.
 *
 *       Before deletion, the system:
 *       - Validates the ID format
 *       - Confirms the visitor exists
 *       - Removes all associated data
 *     tags: [Visitors]
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectID of the visitor record to permanently delete
 *         example: "60d21b4667d0d8992e610c85"
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
 *         description: Invalid ID format - the provided ID is not a valid MongoDB ObjectID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidFormat:
 *                 summary: Malformed ID
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "ID:invalid-id is invalid"
 *                     timestamp: "2025-05-19T12:30:15.123Z"
 *                     path: "/visitors/invalid-id"
 *                     method: "DELETE"
 *                     code: "Bad Request"
 *               shortId:
 *                 summary: ID length error
 *                 value:
 *                   success: false
 *                   data:
 *                     message: "ID:abc123 is invalid"
 *                     timestamp: "2025-05-19T12:31:23.456Z"
 *                     path: "/visitors/abc123"
 *                     method: "DELETE"
 *                     code: "Bad Request"
 *       404:
 *         description: Visitor not found - no record exists with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data:
 *                 message: "VISITOR:60d21b4667d0d8992e610c86 is invalid"
 *                 timestamp: "2025-05-19T12:32:45.789Z"
 *                 path: "/visitors/60d21b4667d0d8992e610c86"
 *                 method: "DELETE"
 *                 code: "Not Found"
 *       500:
 *         description: Server error occurred during the deletion process
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data:
 *                 message: "Something went wrong"
 *                 timestamp: "2025-05-19T12:33:56.123Z"
 *                 path: "/visitors/60d21b4667d0d8992e610c85"
 *                 method: "DELETE"
 *                 code: "Internal Server Error"
 */

// CRUD operational routes for visitor
export default Router()
  .post("/", Controller.addVisitor) // create
  .get("/:visitorId", Controller.getVisitor) // read
  .patch("/:visitorId", Controller.updateVisitor) // update
  .delete("/:visitorId", Controller.deleteVisitor); // delete
