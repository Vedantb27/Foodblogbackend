const express = require('express');
const { updateJsonData, getJsonData } = require('../controllers/jsonController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/update-json', authenticateToken, updateJsonData);
router.get('/get-json', getJsonData);

module.exports = router;
