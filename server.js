const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;

var server = http.createServer(app);

server.listen(PORT, () => {
  console.log('Listening on Port: ', PORT);
});
