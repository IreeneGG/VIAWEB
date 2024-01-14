const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Viajes',
      version: '1.0.0',
      description: 'Documentación de la API de Viajes',
    },
  },
  apis: ['./main.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
