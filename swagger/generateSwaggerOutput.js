const fs = require('fs');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const { options } = require('./swagger');

const swaggerSpec = swaggerJSDoc(options);

// Write to swagger-output.json
fs.writeFileSync(
  path.join(__dirname, 'swagger-output.json'),
  JSON.stringify(swaggerSpec, null, 2),
  'utf8'
);

console.log('✅ Swagger output generated at swagger/swagger-output.json');
