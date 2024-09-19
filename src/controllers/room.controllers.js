const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const Room = require('../models/room.models.js');
const { v4: uniqueId } = require('uuid');
const { emitSocketEvent } = require('../socket/index.js');
const { ChatEventEnum } = require('../constants.js');

const createRoom = asyncHandler(async (req, res) => {
  // create room logic here
  const room = await Room.create({
    admin: req?.user?._id,
    roomId: uniqueId().slice(0, 12),
  });

  if (!room) {
    throw new ApiError(500, 'Failed to create room');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { room }, 'Room created successfully'));
});

const joinRoom = asyncHandler(async (req, res) => {
  const { link, roomId, password } = req.body;
  let id = roomId;

  if (link?.length > 0) {
    // Extract the value after the "=" in the link
    const valueAfterEqual = link.split('=')[1];
    if (valueAfterEqual) {
      id = valueAfterEqual;
    } else {
      throw new ApiError(400, 'Invalid link');
    }
  }

  const room = await Room.findOne({
    roomId: id,
  });

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }
  if (!room?.isActive) {
    throw new ApiError(403, 'Room is not active');
  }
  if (!link?.length > 0) {
    if (room?.password?.length > 0) {
      if (password) {
        const isPasswordValid = await room.isPasswordCorrect(password);

        if (!isPasswordValid) {
          throw new ApiError(401, 'Invalid password');
        }
      } else {
        throw new ApiError(400, 'Password is required');
      }
    }
  }

  res.status(200).json(new ApiResponse(200, { room }, 'Join Successfully.'));
});

module.exports = {
  createRoom,
  joinRoom,
};
