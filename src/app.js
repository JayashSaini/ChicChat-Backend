const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');
const { errorHandler } = require('./middlewares/error.middlewares.js');
const { initializeSocketIO } = require('./socket/index.js');
const { ApiResponse } = require('./utils/ApiResponse.js');

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
});

app.set('io', io);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// session secret
app.use(passport.initialize());
app.use(passport.session());

// Set security headers with Helmet middleware
app.use(helmet());

// Log requests with Morgan middleware (use 'combined' format for production)
app.use(morgan('dev'));

// import routers
const userRouter = require('./routes/auth/user.routes.js');
const chatRouter = require('./routes/chat.routes.js');
const messageRouter = require('./routes/message.routes.js');
const roomRouter = require('./routes/room.routes.js');
const profileRouter = require('./routes/profile.routes.js');

// routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/profile', profileRouter);

initializeSocketIO(io);

// api not found
app.use((req, res) => {
  res.status(404).json(new ApiResponse(404, {}, 'Api not found'));
});

// handle errors
app.use(errorHandler);

module.exports = { httpServer };
