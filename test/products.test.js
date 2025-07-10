import { use, expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import app from "../src/app.js";
import Product from "../src/models/product.js";
import Visitor from "../src/models/visitor.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const chai = use(chaiHttp);

// Increase mocha timeout for slower operations
const TEST_TIMEOUT = 30000; // 30 seconds

describe("Products API", function () {
  // Increase timeout for all tests in this suite
  this.timeout(TEST_TIMEOUT);

  // Store product ID for use in tests
  let productId;

  // Sample valid product data
  const validProduct = {
    name: "Premium Parking",
    price: 150,
    description: "Premium parking spot with direct access to the main entrance",
  };

  // Sample invalid product data
  const invalidProduct = {
    name: "Premium123", // invalid: contains numbers
    price: "not-a-number", // invalid: not numeric
    description: "x".repeat(501), // invalid: exceeds max length
  };

  // Connect to MongoDB before running tests
  before(async function () {
    // Connect to test database
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for testing");

    // Clear products collection
    await Product.deleteMany({});
  });

  // Clean up and disconnect after tests
  after(async function () {
    // Clean up test data
    await Product.deleteMany({});

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB after testing");
  });

  // Test field validations
  describe("Field Validations", () => {
    // Name validation tests
    describe("name validation", () => {
      it("should accept valid name (alphabetic characters)", (done) => {
        const testProduct = { ...validProduct, name: "Standard Parking" };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should trim name", async () => {
        // Create product with spaces in name
        const testProduct = { ...validProduct, name: "  Economy Parking  " };
        const res = await chai.request
          .execute(app)
          .post("/products")
          .send(testProduct);

        expect(res).to.have.status(201);

        // Fetch the product and verify the name is trimmed
        const id = res.body.data.productId;
        const fetchRes = await chai.request.execute(app).get(`/products/${id}`);

        expect(fetchRes.body.data.name).to.equal("Economy Parking");

        // Clean up
        await chai.request.execute(app).delete(`/products/${id}`);
      });

      it("should reject name with numbers", (done) => {
        const testProduct = { ...validProduct, name: "Premium123" };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should reject name with special characters", (done) => {
        const testProduct = { ...validProduct, name: "Premium!" };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should reject name exceeding max length (100 characters)", (done) => {
        const testProduct = {
          ...validProduct,
          name: "A".repeat(101),
        };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require name", (done) => {
        const testProduct = { ...validProduct };
        delete testProduct.name;

        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // Price validation tests
    describe("price validation", () => {
      it("should accept valid price (numeric)", (done) => {
        const testProduct = { ...validProduct, price: 100 };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should reject non-numeric price", (done) => {
        const testProduct = { ...validProduct, price: "not-a-number" };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require price", (done) => {
        const testProduct = { ...validProduct };
        delete testProduct.price;

        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // Description validation tests
    describe("description validation", () => {
      it("should accept valid description", (done) => {
        const testProduct = {
          ...validProduct,
          description: "Standard parking spot near the side entrance",
        };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should trim description", async () => {
        // Create product with spaces in description
        const testProduct = {
          ...validProduct,
          description: "  Economy parking in lot B  ",
        };
        const res = await chai.request
          .execute(app)
          .post("/products")
          .send(testProduct);

        expect(res).to.have.status(201);

        // Fetch the product and verify the description is trimmed
        const id = res.body.data.productId;
        const fetchRes = await chai.request.execute(app).get(`/products/${id}`);

        expect(fetchRes.body.data.description).to.equal(
          "Economy parking in lot B"
        );

        // Clean up
        await chai.request.execute(app).delete(`/products/${id}`);
      });

      it("should reject description exceeding max length (500 characters)", (done) => {
        const testProduct = {
          ...validProduct,
          description: "A".repeat(501),
        };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should allow description to be optional", (done) => {
        const testProduct = { ...validProduct };
        delete testProduct.description;

        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });
    });

    // Test accented characters
    describe("accented characters", () => {
      it("should accept names with accented characters", (done) => {
        const testProduct = {
          ...validProduct,
          name: "Prémiové Parkování",
        };
        chai.request
          .execute(app)
          .post("/products")
          .send(testProduct)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });
    });
  });

  // Test POST /products (Create)
  describe("POST /products", () => {
    it("should create a new product with valid data", (done) => {
      chai.request
        .execute(app)
        .post("/products")
        .send(validProduct)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.have.property("productId");
          // Store the ID for later tests
          productId = res.body.data.productId;
          done();
        });
    });

    it("should return 400 with invalid product data", (done) => {
      chai.request
        .execute(app)
        .post("/products")
        .send(invalidProduct)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          expect(res.body.data).to.have.property("message");
          done();
        });
    });

    it("should return 400 when required fields are missing", (done) => {
      chai.request
        .execute(app)
        .post("/products")
        .send({ name: "Basic Product" }) // Missing price
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });

  // Test GET /products/:productId (Read)
  describe("GET /products/:productId", () => {
    it("should get product by ID", (done) => {
      chai.request
        .execute(app)
        .get(`/products/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.include({
            name: validProduct.name,
            price: validProduct.price,
            description: validProduct.description,
          });
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .get("/products/invalid-id")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          expect(res.body.data.message).to.include("ID:invalid-id is invalid");
          done();
        });
    });

    it("should return 404 for non-existent product", (done) => {
      // Create a valid but non-existent MongoDB ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .get(`/products/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          expect(res.body.data.message).to.include(
            `PRODUCT:${nonExistentId} is invalid`
          );
          done();
        });
    });
  });

  // Test PATCH /products/:productId (Update)
  describe("PATCH /products/:productId", () => {
    it("should update product with valid data", (done) => {
      const update = {
        name: "VIP Parking",
        price: 200,
      };

      chai.request
        .execute(app)
        .patch(`/products/${productId}`)
        .send(update)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.include({
            name: update.name,
            price: update.price,
            description: validProduct.description,
          });
          done();
        });
    });

    it("should return 400 with invalid update data", (done) => {
      chai.request
        .execute(app)
        .patch(`/products/${productId}`)
        .send({ name: "Invalid123" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .patch("/products/invalid-id")
        .send({ name: "Valid Name" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 404 for non-existent product", (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .patch(`/products/${nonExistentId}`)
        .send({ name: "Valid Name" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should trim fields when updating", async () => {
      // Create a product to test with
      const createRes = await chai.request
        .execute(app)
        .post("/products")
        .send(validProduct);

      const testId = createRes.body.data.productId;

      // Update with spaces in fields
      const update = {
        name: "  Deluxe Parking  ",
        description: "  Deluxe parking near main building  ",
      };

      await chai.request.execute(app).patch(`/products/${testId}`).send(update);

      // Fetch to verify trimming occurred
      const fetchRes = await chai.request
        .execute(app)
        .get(`/products/${testId}`);

      expect(fetchRes.body.data.name).to.equal("Deluxe Parking");
      expect(fetchRes.body.data.description).to.equal(
        "Deluxe parking near main building"
      );

      // Clean up
      await chai.request.execute(app).delete(`/products/${testId}`);
    });
  });

  // Test DELETE /products/:productId (Delete)
  describe("DELETE /products/:productId", () => {
    it("should delete product by ID", (done) => {
      chai.request
        .execute(app)
        .delete(`/products/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          done();
        });
    });

    it("should verify product was deleted", (done) => {
      chai.request
        .execute(app)
        .get(`/products/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .delete("/products/invalid-id")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 404 for non-existent product", (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .delete(`/products/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });
});

describe("Visitors API", function () {
  // Increase timeout for all tests in this suite
  this.timeout(TEST_TIMEOUT);

  // Store visitor ID for use in tests
  let visitorId;

  // Sample valid visitor data
  const validVisitor = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+420776504630",
    licensePlate: "ABC123",
  };

  // Sample invalid visitor data
  const invalidVisitor = {
    firstName: "John123", // invalid: contains numbers
    lastName: "Doe",
    email: "invalid-email",
    phone: "123", // invalid phone
    licensePlate: "###",
  };

  // Connect to MongoDB before running tests
  before(async function () {
    // Connect to test database
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for testing");

    // Clear visitors collection
    await Visitor.deleteMany({});
  });

  // Clean up and disconnect after tests
  after(async function () {
    // Clean up test data
    await Visitor.deleteMany({});

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB after testing");
  });

  // Test field validations
  describe("Field Validations", () => {
    // First Name validation tests
    describe("firstName validation", () => {
      it("should accept valid firstName (alphabetic characters)", (done) => {
        const testVisitor = { ...validVisitor, firstName: "Maria" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should trim firstName", async () => {
        // Create visitor with spaces in firstName
        const testVisitor = { ...validVisitor, firstName: "  John  " };
        const res = await chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor);

        expect(res).to.have.status(201);

        // Fetch the visitor and verify the firstName is trimmed
        const id = res.body.data.visitorId;
        const fetchRes = await chai.request.execute(app).get(`/visitors/${id}`);

        expect(fetchRes.body.data.firstName).to.equal("John");

        // Clean up
        await chai.request.execute(app).delete(`/visitors/${id}`);
      });

      it("should reject firstName with numbers", (done) => {
        const testVisitor = { ...validVisitor, firstName: "John123" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should reject firstName with special characters", (done) => {
        const testVisitor = { ...validVisitor, firstName: "John!" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require firstName", (done) => {
        const testVisitor = { ...validVisitor };
        delete testVisitor.firstName;

        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // Last Name validation tests
    describe("lastName validation", () => {
      it("should accept valid lastName (alphabetic characters)", (done) => {
        const testVisitor = { ...validVisitor, lastName: "Smith" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should trim lastName", async () => {
        // Create visitor with spaces in lastName
        const testVisitor = { ...validVisitor, lastName: "  Smith  " };
        const res = await chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor);

        expect(res).to.have.status(201);

        // Fetch the visitor and verify the lastName is trimmed
        const id = res.body.data.visitorId;
        const fetchRes = await chai.request.execute(app).get(`/visitors/${id}`);

        expect(fetchRes.body.data.lastName).to.equal("Smith");

        // Clean up
        await chai.request.execute(app).delete(`/visitors/${id}`);
      });

      it("should reject lastName with numbers", (done) => {
        const testVisitor = { ...validVisitor, lastName: "Smith123" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require lastName", (done) => {
        const testVisitor = { ...validVisitor };
        delete testVisitor.lastName;

        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // Email validation tests
    describe("email validation", () => {
      it("should accept valid email", (done) => {
        const testVisitor = { ...validVisitor, email: "test@example.com" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should trim email", async () => {
        // Create visitor with spaces in email
        const testVisitor = { ...validVisitor, email: "  test@example.com  " };
        const res = await chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor);

        expect(res).to.have.status(201);

        // Fetch the visitor and verify the email is trimmed
        const id = res.body.data.visitorId;
        const fetchRes = await chai.request.execute(app).get(`/visitors/${id}`);

        expect(fetchRes.body.data.email).to.equal("test@example.com");

        // Clean up
        await chai.request.execute(app).delete(`/visitors/${id}`);
      });

      it("should reject invalid email format", (done) => {
        const testVisitor = { ...validVisitor, email: "invalid-email" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should normalize email to lowercase", async () => {
        // Create visitor with mixed case email
        const testVisitor = { ...validVisitor, email: "Test.USER@Example.com" };
        const res = await chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor);

        expect(res).to.have.status(201);

        // Verify the API normalizes the email case
        const id = res.body.data.visitorId;
        const fetchRes = await chai.request.execute(app).get(`/visitors/${id}`);

        // Check that email is stored in lowercase
        expect(fetchRes.body.data.email).to.equal(
          testVisitor.email.toLowerCase()
        );

        // Clean up
        await chai.request.execute(app).delete(`/visitors/${id}`);
      });

      it("should require email", (done) => {
        const testVisitor = { ...validVisitor };
        delete testVisitor.email;

        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // Phone validation tests
    describe("phone validation", () => {
      it("should accept valid phone number", (done) => {
        const testVisitor = { ...validVisitor, phone: "+1-202-555-0156" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should trim phone", async () => {
        // Create visitor with spaces in phone
        const testVisitor = { ...validVisitor, phone: "  +1-202-555-0156  " };
        const res = await chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor);

        expect(res).to.have.status(201);

        // Fetch the visitor and verify the phone is trimmed
        const id = res.body.data.visitorId;
        const fetchRes = await chai.request.execute(app).get(`/visitors/${id}`);

        expect(fetchRes.body.data.phone).to.equal("+1-202-555-0156");

        // Clean up
        await chai.request.execute(app).delete(`/visitors/${id}`);
      });

      it("should reject invalid phone number", (done) => {
        const testVisitor = { ...validVisitor, phone: "123" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require phone", (done) => {
        const testVisitor = { ...validVisitor };
        delete testVisitor.phone;

        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // License plate validation tests
    describe("licensePlate validation", () => {
      it("should accept valid license plate", (done) => {
        const testVisitor = { ...validVisitor, licensePlate: "ABC-123" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should trim licensePlate", async () => {
        // Create visitor with spaces in licensePlate
        const testVisitor = { ...validVisitor, licensePlate: "  ABC-123  " };
        const res = await chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor);

        expect(res).to.have.status(201);

        // Fetch the visitor and verify the licensePlate is trimmed
        const id = res.body.data.visitorId;
        const fetchRes = await chai.request.execute(app).get(`/visitors/${id}`);

        expect(fetchRes.body.data.licensePlate).to.equal("ABC-123");

        // Clean up
        await chai.request.execute(app).delete(`/visitors/${id}`);
      });

      it("should reject invalid license plate", (done) => {
        const testVisitor = { ...validVisitor, licensePlate: "###" };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should allow licensePlate to be optional", (done) => {
        const testVisitor = { ...validVisitor };
        delete testVisitor.licensePlate;

        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });
    });

    // Add to the field validation tests
    describe("empty string handling", () => {
      it("should reject empty strings for required fields", (done) => {
        const testVisitor = {
          ...validVisitor,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        };

        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // Test accented characters
    describe("accented characters", () => {
      it("should accept names with accented characters", (done) => {
        const testVisitor = {
          ...validVisitor,
          firstName: "Růžena",
          lastName: "Říhová",
        };
        chai.request
          .execute(app)
          .post("/visitors")
          .send(testVisitor)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });
    });
  });

  // Test POST /visitors (Create)
  describe("POST /visitors", () => {
    it("should create a new visitor with valid data", (done) => {
      chai.request
        .execute(app)
        .post("/visitors")
        .send(validVisitor)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.have.property("visitorId");
          // Store the ID for later tests
          visitorId = res.body.data.visitorId;
          done();
        });
    });

    it("should return 400 with invalid visitor data", (done) => {
      chai.request
        .execute(app)
        .post("/visitors")
        .send(invalidVisitor)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          expect(res.body.data).to.have.property("message");
          done();
        });
    });

    it("should return 400 when required fields are missing", (done) => {
      chai.request
        .execute(app)
        .post("/visitors")
        .send({ firstName: "John" }) // Missing required fields
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });

  // Test GET /visitors/:visitorId (Read)
  describe("GET /visitors/:visitorId", () => {
    it("should get visitor by ID", (done) => {
      chai.request
        .execute(app)
        .get(`/visitors/${visitorId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.include({
            firstName: validVisitor.firstName,
            lastName: validVisitor.lastName,
            email: validVisitor.email,
            phone: validVisitor.phone,
            licensePlate: validVisitor.licensePlate,
          });
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .get("/visitors/invalid-id")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          expect(res.body.data.message).to.include("ID:invalid-id is invalid");
          done();
        });
    });

    it("should return 404 for non-existent visitor", (done) => {
      // Create a valid but non-existent MongoDB ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .get(`/visitors/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          expect(res.body.data.message).to.include(
            `VISITOR:${nonExistentId} is invalid`
          );
          done();
        });
    });
  });

  // Test PATCH /visitors/:visitorId (Update)
  describe("PATCH /visitors/:visitorId", () => {
    it("should update visitor with valid data", (done) => {
      const update = {
        firstName: "Jane",
        phone: "+1-202-555-0156", // Using a more standard international format
      };

      chai.request
        .execute(app)
        .patch(`/visitors/${visitorId}`)
        .send(update)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.include({
            firstName: update.firstName,
            phone: update.phone,
            lastName: validVisitor.lastName,
            email: validVisitor.email,
            licensePlate: validVisitor.licensePlate,
          });
          done();
        });
    });

    it("should return 400 with invalid update data", (done) => {
      chai.request
        .execute(app)
        .patch(`/visitors/${visitorId}`)
        .send({ email: "invalid-email" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .patch("/visitors/invalid-id")
        .send({ firstName: "TestName" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 404 for non-existent visitor", (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .patch(`/visitors/${nonExistentId}`)
        .send({ firstName: "TestName" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should trim fields when updating", async () => {
      // Create a visitor to test with
      const createRes = await chai.request
        .execute(app)
        .post("/visitors")
        .send(validVisitor);

      const testId = createRes.body.data.visitorId;

      // Update with spaces in fields
      const update = {
        firstName: "  Robert  ",
        email: "  robert@example.com  ",
      };

      await chai.request.execute(app).patch(`/visitors/${testId}`).send(update);

      // Fetch to verify trimming occurred
      const fetchRes = await chai.request
        .execute(app)
        .get(`/visitors/${testId}`);

      expect(fetchRes.body.data.firstName).to.equal("Robert");
      expect(fetchRes.body.data.email).to.equal("robert@example.com");

      // Clean up
      await chai.request.execute(app).delete(`/visitors/${testId}`);
    });
  });

  // Test DELETE /visitors/:visitorId (Delete)
  describe("DELETE /visitors/:visitorId", () => {
    it("should delete visitor by ID", (done) => {
      chai.request
        .execute(app)
        .delete(`/visitors/${visitorId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          done();
        });
    });

    it("should verify visitor was deleted", (done) => {
      chai.request
        .execute(app)
        .get(`/visitors/${visitorId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .delete("/visitors/invalid-id")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 404 for non-existent visitor", (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .delete(`/visitors/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });
});

describe("Orders API", function () {
  // Increase timeout for all tests in this suite
  this.timeout(TEST_TIMEOUT);

  // Store IDs for use in tests
  let orderId;
  let visitorId;
  let productId;

  // Sample valid order data (will be populated in before())
  let validOrder = {};

  // Sample invalid order data
  const invalidOrder = {
    visitorId: "invalid-id",
    productId: "invalid-id",
    startDate: "not-a-date",
    duration: "not-a-number",
    quantity: 100, // exceeds max of 99
  };

  // Connect to MongoDB before running tests
  before(async function () {
    // Connect to test database
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for testing");

    // Clear orders collection
    await mongoose.connection.collection("orders").deleteMany({});

    // Create a test visitor
    const visitorResponse = await chai.request
      .execute(app)
      .post("/visitors")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+420776504630",
        licensePlate: "ABC123",
      });
    visitorId = visitorResponse.body.data.visitorId;

    // Create a test product
    const productResponse = await chai.request
      .execute(app)
      .post("/products")
      .send({
        name: "Premium Parking",
        price: 150,
        description:
          "Premium parking spot with direct access to the main entrance",
      });
    productId = productResponse.body.data.productId;

    // Set up valid order data with created IDs
    validOrder = {
      visitorId: visitorId,
      productId: productId,
      startDate: new Date("2025-06-15T10:00:00.000Z").toISOString(),
      duration: 3600000, // 1 hour in milliseconds
      quantity: 2,
    };
  });

  // Clean up and disconnect after tests
  after(async function () {
    // Clean up test data
    await mongoose.connection.collection("orders").deleteMany({});

    // Delete the test visitor and product
    await chai.request.execute(app).delete(`/visitors/${visitorId}`);
    await chai.request.execute(app).delete(`/products/${productId}`);

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB after testing");
  });

  // Test field validations
  describe("Field Validations", () => {
    // visitorId validation tests
    describe("visitorId validation", () => {
      it("should reject invalid visitorId format", (done) => {
        const testOrder = { ...validOrder, visitorId: "invalid-id" };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should reject non-existent visitorId", (done) => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const testOrder = { ...validOrder, visitorId: nonExistentId };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require visitorId", (done) => {
        const testOrder = { ...validOrder };
        delete testOrder.visitorId;

        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // productId validation tests
    describe("productId validation", () => {
      it("should reject invalid productId format", (done) => {
        const testOrder = { ...validOrder, productId: "invalid-id" };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should reject non-existent productId", (done) => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const testOrder = { ...validOrder, productId: nonExistentId };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require productId", (done) => {
        const testOrder = { ...validOrder };
        delete testOrder.productId;

        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // startDate validation tests
    describe("startDate validation", () => {
      it("should accept valid date", (done) => {
        const testOrder = {
          ...validOrder,
          startDate: new Date("2025-07-15T14:00:00.000Z").toISOString(),
        };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should reject invalid date format", (done) => {
        const testOrder = { ...validOrder, startDate: "not-a-date" };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require startDate", (done) => {
        const testOrder = { ...validOrder };
        delete testOrder.startDate;

        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // duration validation tests
    describe("duration validation", () => {
      it("should accept valid duration (numeric)", (done) => {
        const testOrder = { ...validOrder, duration: 7200000 }; // 2 hours
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should reject non-numeric duration", (done) => {
        const testOrder = { ...validOrder, duration: "not-a-number" };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require duration", (done) => {
        const testOrder = { ...validOrder };
        delete testOrder.duration;

        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });

    // quantity validation tests
    describe("quantity validation", () => {
      it("should accept valid quantity (numeric, <= 99)", (done) => {
        const testOrder = { ...validOrder, quantity: 5 };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("success", true);
            done();
          });
      });

      it("should reject non-numeric quantity", (done) => {
        const testOrder = { ...validOrder, quantity: "not-a-number" };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should reject quantity exceeding maximum (99)", (done) => {
        const testOrder = { ...validOrder, quantity: 100 };
        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });

      it("should require quantity", (done) => {
        const testOrder = { ...validOrder };
        delete testOrder.quantity;

        chai.request
          .execute(app)
          .post("/orders")
          .send(testOrder)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("success", false);
            done();
          });
      });
    });
  });

  // Test POST /orders (Create)
  describe("POST /orders", () => {
    it("should create a new order with valid data", (done) => {
      chai.request
        .execute(app)
        .post("/orders")
        .send(validOrder)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.have.property("orderId");
          // Store the ID for later tests
          orderId = res.body.data.orderId;
          done();
        });
    });

    it("should return 400 with invalid order data", (done) => {
      chai.request
        .execute(app)
        .post("/orders")
        .send(invalidOrder)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          expect(res.body.data).to.have.property("message");
          done();
        });
    });

    it("should return 400 when required fields are missing", (done) => {
      chai.request
        .execute(app)
        .post("/orders")
        .send({ visitorId, productId }) // Missing other required fields
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });

  // Test GET /orders/:orderId (Read)
  describe("GET /orders/:orderId", () => {
    it("should get order by ID", (done) => {
      chai.request
        .execute(app)
        .get(`/orders/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.include({
            visitorId: validOrder.visitorId,
            productId: validOrder.productId,
            duration: validOrder.duration,
            quantity: validOrder.quantity,
          });
          // Date comparison requires special handling
          expect(new Date(res.body.data.startDate).toISOString()).to.equal(
            validOrder.startDate
          );
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .get("/orders/invalid-id")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 404 for non-existent order", (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .get(`/orders/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });

  // Test PATCH /orders/:orderId (Update)
  describe("PATCH /orders/:orderId", () => {
    it("should update order with valid data", (done) => {
      const update = {
        startDate: new Date("2025-06-16T14:00:00.000Z").toISOString(),
        quantity: 3,
      };

      chai.request
        .execute(app)
        .patch(`/orders/${orderId}`)
        .send(update)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body.data).to.include({
            quantity: update.quantity,
            visitorId: validOrder.visitorId,
            productId: validOrder.productId,
            duration: validOrder.duration,
          });
          // Date comparison
          expect(new Date(res.body.data.startDate).toISOString()).to.equal(
            update.startDate
          );
          done();
        });
    });

    it("should return 400 with invalid update data", (done) => {
      chai.request
        .execute(app)
        .patch(`/orders/${orderId}`)
        .send({ quantity: 100 }) // Exceeds max of 99
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .patch("/orders/invalid-id")
        .send({ quantity: 5 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 404 for non-existent order", (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .patch(`/orders/${nonExistentId}`)
        .send({ quantity: 5 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });

  // Test DELETE /orders/:orderId (Delete)
  describe("DELETE /orders/:orderId", () => {
    it("should delete order by ID", (done) => {
      chai.request
        .execute(app)
        .delete(`/orders/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          done();
        });
    });

    it("should verify order was deleted", (done) => {
      chai.request
        .execute(app)
        .get(`/orders/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 400 with invalid ID format", (done) => {
      chai.request
        .execute(app)
        .delete("/orders/invalid-id")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });

    it("should return 404 for non-existent order", (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();

      chai.request
        .execute(app)
        .delete(`/orders/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });
});
