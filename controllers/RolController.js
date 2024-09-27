const Rol = require('../models/Rol');
const { body, validationResult } = require('express-validator');
const Area = require('../models/Area');

const createRol = [
    body('rol_name').trim().notEmpty().withMessage('El nombre es requerido.')
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[a-zA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras.'),
    body('are_id').trim().notEmpty().withMessage('El área es requerida.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const allErrors = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: allErrors });
        }
        try {
            const rol = await Rol.create(req.body);
            res.status(201).json(rol);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

const getAllRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll({
            include: [
                {
                    model: Area, 
                    attributes: ['are_id', 'are_name']
                } 
            ] 
        });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRolById = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRol = [
    body('rol_name').trim().optional()
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[a-zA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras.'),
    body('are_id').trim().optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const rol = await Rol.findByPk(req.params.id);
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }
            await rol.update(req.body);
            res.status(200).json(rol);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

const deleteRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        await rol.destroy();
        res.status(200).json({ message: 'Rol eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRol,
    getAllRoles,
    getRolById,
    updateRol,
    deleteRol
};
