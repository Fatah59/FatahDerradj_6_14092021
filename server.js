const http = require('http');
const { normalize } = require('path');

// Importer l'application
const app = require('./app');

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHanler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(blind + 'requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//  Indication du port à l'application Express

const server = http.createServer(app);

server.on('error', errorHanler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
  console.log('Listening on' + bind);
});

server.listen(port);
