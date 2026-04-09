const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @param {import('express').Express} app
 * @param {number} port
 */
function setupSwagger(app, port) {
  const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Smart Campus Transportation API',
        version: '1.0.0',
        description:
          'REST API for campus transport. Use **Authorize** and paste `Bearer <your_jwt>` or only the token depending on UI version.',
      },
      servers: [{ url: `http://localhost:${port}`, description: 'Local' }],
    },
    apis: [path.join(__dirname, 'openapi.docs.js')],
  };

  const spec = swaggerJsdoc(options);

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        tryItOutEnabled: true,
      },
    })
  );

  app.get('/api-docs.json', (req, res) => {
    res.json(spec);
  });
}

module.exports = { setupSwagger };
