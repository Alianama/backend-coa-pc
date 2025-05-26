const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "COA Creator Plastic Colorant API",
      version: "1.0.0",
      description: "API Documentation untuk COA Creator Plastic Colorant",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/swagger/*.js", "./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
