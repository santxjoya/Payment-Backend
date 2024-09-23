const express = require('express');
const {
    getAllNews,
    getNewById,
} = require('../controllers/NewController');
const router = express.Router();

router.get('/news', getAllNews);
router.get('/news/:id', getNewById);

module.exports = router;
