const Area = require('../models/Area');
const { body, validationResult } = require('express-validator');


const createArea = [
    // Validaciones
    body('are_name').trim().notEmpty().withMessage('El nombre es requerido.')
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0].msg;
            return res.status(400).json({ error: firstError });
        }
        //Si la validaciones están bien Crea la nueva Area
        try {
            const area = await Area.create(req.body);
            res.status(201).json(area);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

const getAllAreas = async (req, res) => {
    try {
        const areas = await Area.findAll();
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAreaById = async (req, res) => {
    try {
        const area = await Area.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Area no encontrado' });
        }
        res.status(200).json(area);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateArea = [
    // Validaciones para `are_name`
    body('are_name').trim().optional()
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const area = await Area.findByPk(req.params.id);
            if (!area) {
                return res.status(404).json({ message: 'Área no encontrada' });
            }
            // Actualiza el área con los datos válidos
            await area.update(req.body);
            res.status(200).json(area);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

const deleteArea = async (req, res) => {
    try {
        const area = await Area.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Area no encontrado' });
        }
        await area.destroy();
        res.status(200).json({ message: 'Area eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea
};
