const Suppliers = require('../models/Suppliers');
const { body, validationResult } = require('express-validator');

const createSupplier = [
    body('sup_name').trim().notEmpty().withMessage('El nombre es requerido.')
    .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
    .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    async (req, res) => {
    try {
        const supplier = await Suppliers.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Suppliers.findAll();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await Suppliers.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSupplier = [
    body('sup_name').trim().optional()
    .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
    .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),

    async (req, res) => {
    try {
        const supplier = await Suppliers.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        await supplier.update(req.body);
        res.status(200).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];

const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Suppliers.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        await supplier.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};
