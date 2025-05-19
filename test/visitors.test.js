import { use, expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import app from "../src/app.js";
import Visitor from "../src/models/visitor.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const chai = use(chaiHttp);

// Increase mocha timeout for slower operations
const TEST_TIMEOUT = 30000; // Increase to 30 seconds

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
