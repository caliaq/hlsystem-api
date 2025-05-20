import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

// Update the apis array with better ordering
const apis = [
  // Core definitions first
  path.join(rootDir, "src/docs/tags.js"),

  // Component schemas (followed by responses to allow references)
  path.join(rootDir, "src/docs/schemas/visitor.js"),
  path.join(rootDir, "src/docs/schemas/product.js"),
  path.join(rootDir, "src/docs/schemas/order.js"),
  path.join(rootDir, "src/docs/schemas/examples.js"),
  path.join(rootDir, "src/docs/schemas/responses/*.js"),
  path.join(rootDir, "src/docs/schemas/parameters.js"),

  // Endpoints last (they reference components)
  path.join(rootDir, "src/docs/paths/visitors/*.js"),
  path.join(rootDir, "src/docs/paths/orders/*.js"),
  path.join(rootDir, "src/docs/paths/products/*.js"),
];

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
    // Initialize all components to prevent reference errors
    components: {
      schemas: {},
      examples: {},
      responses: {},
      parameters: {},
    },
  },
  // Clear organization of API files - loading order is critical!
  apis: apis,
  // Add these options for better debugging
  failOnErrors: true, // Enable to catch reference errors
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Optional: Write the generated spec to a file for debugging
// fs.writeFileSync(path.join(rootDir, 'swagger-output.json'), JSON.stringify(specs, null, 2));

export default {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: `.swagger-ui .topbar { display: none }
                .swagger-ui .info { margin: 30px 0 }
                .swagger-ui .scheme-container { margin: 30px 0 }`,
    swaggerOptions: {
      docExpansion: "none", // Collapse all endpoints by default
      filter: true,
      tagsSorter: "alpha",
      operationsSorter: "method",
      persistAuthorization: true,
      defaultModelsExpandDepth: 1,
      supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],
    },
  }),
};
