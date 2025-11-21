import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const rawUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 8080}`;
// remove trailing '/api' or '/api/' if present so server url remains host:port only
const serverUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

// Support both source (dev) and dist (production) JSDoc locations.
// When running compiled app (node dist/index.js) the JS files with comments live under dist/.
const isProd = process.env.NODE_ENV === 'production';

// Build apis globs relative to project root
const apis = isProd
  ? [
      path.join(__dirname, '..', 'dist', 'routers', '*.js'),
      path.join(__dirname, '..', 'dist', 'controllers', '*.js'),
      path.join(__dirname, '..', 'dist', 'models', '*.js'),
    ]
  : [
      path.join(__dirname, 'routers', '*.ts'),
      path.join(__dirname, 'controllers', '*.ts'),
      path.join(__dirname, 'models', '*.ts'),
    ];

// Also include both patterns as a fallback (helps some deploy setups)
const apisFallback = [
  path.join(__dirname, 'routers', '*.ts'),
  path.join(__dirname, 'controllers', '*.ts'),
  path.join(__dirname, 'models', '*.ts'),
  path.join(__dirname, '..', 'dist', 'routers', '*.js'),
  path.join(__dirname, '..', 'dist', 'controllers', '*.js'),
  path.join(__dirname, '..', 'dist', 'models', '*.js'),
];

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
  // prefer environment-specific list, then fallback; swagger-jsdoc accepts array
  apis: apisFallback,
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
