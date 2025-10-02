const express = require('express');
const router = express.Router()
const requestController = require('../controllers/requestController')
const RequestController = new requestController();

router.post('/', RequestController.createRequest.bind(RequestController));
router.post('/register', RequestController.registerUser.bind(RequestController));
router.post('/login', RequestController.login.bind(RequestController));
router.get('/get', RequestController.getAllRequest.bind(RequestController));

module.exports = router;