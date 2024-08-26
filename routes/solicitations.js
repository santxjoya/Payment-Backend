const express = require('express');
const {
    createSolicitation,
    getAllSolicitations,
    getSolicitationById,
    updateSolicitation,
    deleteSolicitation
} = require('../controllers/SolicitationController');
const router = express.Router();

router.post('/solicitations', createSolicitation);
router.get('/solicitations', getAllSolicitations);
router.get('/solicitations/:id', getSolicitationById);
router.put('/solicitations/:id', updateSolicitation);
router.delete('/solicitations/:id', deleteSolicitation);

module.exports = router;
