const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @param {import('express').Express} app
 * @param {import('../../config/env.service')} env
 */
function setupSwagger(app, env) {
  const servers = [];
  if (env.apiPublicUrl) {
    servers.push({ url: env.apiPublicUrl, description: 'Deployed' });
  }
  servers.push({
    url: `http://127.0.0.1:${env.port}`,
    description: 'Local development',
  });

  const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Smart Campus Transportation API',
        version: '1.0.0',
        description:
          'REST API for campus transport. Use **Authorize** and paste `Bearer <your_jwt>` or only the token depending on UI version.',
      },
      servers,
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
