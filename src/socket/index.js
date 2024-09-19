const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { ChatEventEnum } = require('../constants.js');
const { User } = require('../models/auth/user.models.js');
const { ApiError } = require('../utils/ApiError.js');
const Room = require('../models/room.models.js');

const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

// Video Calling Events (for multiple participants)
const mountVideoCallEvents = (socket, io) => {
  // Ask admin to join the room
  socket.on('admin:join-request', async (data) => {
    const { user, roomId } = data;

    try {
      const room = await Room.findOne({ roomId });

      if (room?.admin) {
        io.to(room.admin.toString()).emit('admin:user-approve', {
          user,
        });
      } else {
        socket.emit('error', { message: 'Room or admin not found' });
      }
    } catch (error) {
      socket.emit('error', { message: 'Error fetching room data', error });
    }
  });

  // Handle admin's approval of user joining the room
  socket.on('admin:approve-user', async (data) => {
    const { roomId, userId } = data;

    try {
      const room = await Room.findOneAndUpdate(
        { roomId },
        { $addToSet: { participants: userId.toString() } }, // Ensure userId is added to participants
        { new: true }
      );

      if (room) {
        // Notify the approved user
        io.to(userId).emit('room:join:approved', { roomId });

        // Notify all participants in the room that the user has joined
        io.to(roomId).emit('user:joined', { userId });

        // Add the approved user (whose socket ID is userId) to the room
        const userSocket = io.sockets.sockets.get(userId);
        if (userSocket) {
          userSocket.join(roomId);
        } else {
          socket.emit('error', { message: 'User is not connected' });
        }
      } else {
        socket.emit('error', { message: 'Room not found' });
      }
    } catch (error) {
      socket.emit('error', { message: 'Error updating room data', error });
    }
  });

  // Handle rejection of user's join request
  socket.on('admin:reject-user', ({ userId }) => {
    // Notify the rejected user
    io.to(userId).emit('room:join:rejected', {
      message: 'Your request to join the room was rejected by the admin.',
    });
  });
};

const initializeSocketIO = (io) => {
  return io.on('connection', async (socket) => {
    try {
      // Parse the cookies from the handshake headers
      const cookies = cookie.parse(socket.handshake.headers?.cookie || '');
      let token = cookies?.accessToken || socket.handshake.auth?.token;

      if (!token)
        throw new ApiError(401, 'Unauthorized handshake. Token is missing');

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken'
      );

      if (!user)
        throw new ApiError(401, 'Unauthorized handshake. Invalid token');

      socket.user = user;

      socket.join(user._id.toString()); // Create a room for the user

      socket.emit(ChatEventEnum.CONNECTED_EVENT); // Notify client of successful connection

      console.log('User connected 🗼. userId: ', user._id.toString());

      // Mount common chat-related events
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      // Mount video calling events
      mountVideoCallEvents(socket, io);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log('User disconnected 🚫. userId: ' + socket.user?._id);
        socket.leave(socket.user._id);
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || 'Something went wrong while connecting to the socket.'
      );
    }
  });
};

// Utility function to emit events to a specific room (chat)
const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get('io').in(roomId).emit(event, payload);
};

module.exports = { initializeSocketIO, emitSocketEvent };
