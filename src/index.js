require('dotenv').config({
  path: './.env',
});
const { httpServer } = require('./app.js');
const connectDB = require('./db/index.js');

(async () => {
  // connect mongodb database
  await connectDB();

  // start http server
  httpServer.listen(process.env.PORT, () => {
    console.log(`🚝 Server is running on port ${process.env.PORT}`);
  });
})();
