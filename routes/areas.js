const express = require('express');
const {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea
} = require('../controllers/AreaController');
const router = express.Router();

router.post('/areas', createArea);
router.get('/areas', getAllAreas);
router.get('/areas/:id', getAreaById);
router.put('/areas/:id', updateArea);
router.delete('/areas/:id', deleteArea);

module.exports = router;
