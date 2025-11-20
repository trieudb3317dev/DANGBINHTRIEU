import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const rawUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 8080}`;
// remove trailing '/api' or '/api/' if present so server url remains host:port only
const serverUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Problem 5 API',
      version: '1.0.0',
      description: 'API documentation for Problem 5',
    },
    servers: [
      {
        url: serverUrl,
        deploymentEnvironment: process.env.NODE_ENV || 'development',
      },
    ],
  },
  apis: ['./src/routers/*.ts', './src/controllers/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
