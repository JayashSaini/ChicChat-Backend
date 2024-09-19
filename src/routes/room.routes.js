const { Router } = require('express');
const router = Router();

const { createRoom, joinRoom } = require('../controllers/room.controllers.js');
const { verifyJWT } = require('../middlewares/auth.middlewares.js');
const { joinRoomValidator } = require('../validators/room.validators.js');
const { validate } = require('../validators/validate.js');

router.use(verifyJWT);

router.route('/').post(createRoom);

router.route('/join').post(joinRoomValidator(), validate, joinRoom);

module.exports = router;
