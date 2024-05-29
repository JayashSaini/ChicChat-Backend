const dotenv = require('dotenv');
const { httpServer } = require('./app.js');

dotenv.config({
  path: './.env',
});

(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`🚝 Server is running on port ${process.env.PORT}`);
  });
})();
