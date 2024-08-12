const express = require('express');
const {
    createRol,
    getAllRoles,
    getRolById,
    updateRol,
    deleteRol
} = require('../controllers/RolController');
const router = express.Router();

router.post('/roles', createRol);
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRolById);
router.put('/roles/:id', updateRol);
router.delete('/roles/:id', deleteRol);

module.exports = router;
