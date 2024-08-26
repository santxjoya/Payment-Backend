const express = require('express');
const {
    createTypeSolicitation,
    getAllTypeSolicitations,
    getTypeSolicitationById,
    updateTypeSolicitation,
    deleteTypeSolicitation
} = require('../controllers/TypeSolicitationController');
const router = express.Router();

router.post('/type/solicitations', createTypeSolicitation);
router.get('/type/solicitations', getAllTypeSolicitations);
router.get('/type/solicitations/:id', getTypeSolicitationById);
router.put('/type/solicitations/:id', updateTypeSolicitation);
router.delete('/type/solicitations/:id', deleteTypeSolicitation);

module.exports = router;
