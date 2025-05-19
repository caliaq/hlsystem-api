import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Visitors API Documentation",
      version: "1.0.0",
      description:
        "A comprehensive REST API for managing visitor registration, tracking, and information management. This API enables creating, retrieving, updating, and deleting visitor records while ensuring data validation and security.",
      contact: {
        name: "caliaq",
        email: "support@caliaq.dev",
        url: "https://caliaq.dev",
      },
    },
    servers: [
      {
        url: "http://localhost:80",
        description: "Local development server",
      },
    ],
    components: {
      schemas: {
        Visitor: {
          type: "object",
          required: ["firstName", "lastName", "email", "phone"],
          properties: {
            _id: {
              type: "string",
              description:
                "Auto-generated MongoDB ObjectID that uniquely identifies the visitor record in the database",
            },
            firstName: {
              type: "string",
              description:
                "First name of the visitor (2-50 alphabetic characters only, no special characters or numbers allowed)",
            },
            lastName: {
              type: "string",
              description:
                "Last name of the visitor (2-50 alphabetic characters only, no special characters or numbers allowed)",
            },
            email: {
              type: "string",
              format: "email",
              description:
                "Valid email address of the visitor (must include @ and domain, e.g., name@example.com)",
            },
            phone: {
              type: "string",
              description:
                "Mobile phone number of the visitor in international format (e.g., +420776504630). Used for access notifications and security verification.",
            },
            licensePlate: {
              type: "string",
              description:
                "Vehicle registration plate number (optional, alphanumeric, max 15 characters). Required only if visitor arrives by car and needs parking access.",
            },
          },
          example: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+420776504630",
            licensePlate: "ABC123",
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description:
                "Indicates whether the request was successful (always false for error responses)",
              example: false,
            },
            data: {
              type: "object",
              description: "Container for detailed error information",
              properties: {
                message: {
                  type: "string",
                  description:
                    "Human-readable error message explaining what went wrong and possibly how to fix it",
                  example: "EMAIL:invalid-email is invalid",
                },
                timestamp: {
                  type: "string",
                  format: "date-time",
                  description:
                    "ISO 8601 formatted date and time when the error occurred",
                  example: "2025-05-19T12:00:00.000Z",
                },
                path: {
                  type: "string",
                  description:
                    "The API endpoint path that was accessed when the error occurred",
                  example: "/visitors",
                },
                method: {
                  type: "string",
                  description:
                    "The HTTP method used in the request (GET, POST, PUT, DELETE, etc.)",
                  example: "POST",
                },
                code: {
                  type: "string",
                  description:
                    "HTTP status code description corresponding to the error type",
                  example: "Bad Request",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/models/*.js"], // Path to the API docs
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

export default {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { explorer: true }),
};
