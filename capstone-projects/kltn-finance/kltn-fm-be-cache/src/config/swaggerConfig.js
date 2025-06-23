import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ENV } from "../static/constant.js";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Cache",
      version: "1.0.0",
      description: "API documentation",
      contact: {
        name: "API Support",
        email: "support@financecache.com",
      },
    },
    servers: [
      {
        url: `finance-cache.onrender.com`,
        description: "Remote server",
      },
      {
        url: `http://localhost:${ENV.SERVER_PORT}`,
        description: "Local server",
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/docs/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export { swaggerUi, swaggerDocs };
