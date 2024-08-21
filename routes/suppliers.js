const express = require('express');

const {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require('../controllers/SuppliersController');

const router = express.Router();
router.post('/suppliers', createSupplier);
router.get('/suppliers', getSuppliers);
router.get('/suppliers/:id', getSupplierById);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

module.exports =  router;
