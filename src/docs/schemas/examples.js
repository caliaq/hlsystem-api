/**
 * @openapi
 * components:
 *   examples:
 *     standardVisitor:
 *       summary: Complete visitor record
 *       value:
 *         firstName: "Anna"
 *         lastName: "Nováková"
 *         email: "anna.novakova@example.com"
 *         phone: "+420776123456"
 *         licensePlate: "1AB2345"
 *     minimalVisitor:
 *       summary: Minimal visitor without optional fields
 *       value:
 *         firstName: "Jan"
 *         lastName: "Svoboda"
 *         email: "jan.svoboda@example.com"
 *         phone: "+420601234567"
 *     internationalVisitor:
 *       summary: International visitor with different phone format
 *       value:
 *         firstName: "Thomas"
 *         lastName: "Schmidt"
 *         email: "thomas.schmidt@example.de"
 *         phone: "+49170123456"
 *         licensePlate: "M-AB-1234"
 *     contactUpdate:
 *       summary: Update contact information
 *       value:
 *         email: "anna.marie@example.com"
 *         phone: "+420777987654"
 *     nameChange:
 *       summary: Update name after marriage
 *       value:
 *         firstName: "Anna Marie"
 *         lastName: "Svobodová"
 *     vehicleChange:
 *       summary: Update license plate only
 *       value:
 *         licensePlate: "2CD6789"
 *     removeVehicle:
 *       summary: Remove license plate (set to empty string)
 *       value:
 *         licensePlate: ""
 */
