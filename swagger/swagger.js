const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API with Express & MongoDB',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: {
              type: 'string',
              example: 'My First Post'
            },
            content: {
              type: 'string',
              example: 'This is the content of my first blog post.'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '605c5d5e3f1f1b23dc7e4b8a'
            },
            displayName: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              example: 'john@example.com'
            }
          }
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
  options,
};
