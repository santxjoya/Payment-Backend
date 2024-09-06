const Type_Solicitation = require('../models/Type_solicitation');
const { body, validationResult } = require('express-validator');

const createTypeSolicitation = [
    body('typ_sol_name').trim()
    .notEmpty().withMessage('El nombre es requerido.')
    .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
    .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0].msg;
            return res.status(400).json({ error: firstError });
        }
        try {
            const type_Solicitation = await Type_Solicitation.create(req.body);
            res.status(201).json(type_Solicitation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];
const getAllTypeSolicitations = async (req, res) => {
    try {
        const type_Solicitations = await Type_Solicitation.findAll();
        res.status(200).json(type_Solicitations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTypeSolicitationById = async (req, res) => {
    try {
        const type_Solicitation = await Type_Solicitation.findByPk(req.params.id);
        if (!Type_Solicitation) {
            return res.status(404).json({ message: 'Tipo de solicitud no encontrado' });
        }
        res.status(200).json(type_Solicitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTypeSolicitation = [
    body('typ_sol_name').trim().optional()
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const type_Solicitation = await Type_Solicitation.findByPk(req.params.id);
            if (!type_Solicitation) {
                return res.status(404).json({ message: 'Tipo de solicitud no encontrado' });
            }
            await type_Solicitation.update(req.body);
            res.status(200).json(type_Solicitation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];


const deleteTypeSolicitation = async (req, res) => {
    try {
        const type_Solicitation = await Type_Solicitation.findByPk(req.params.id);
        if (!type_Solicitation) {
            return res.status(404).json({ message: 'Tipo de solicitud no encontrado' });
        }
        await type_Solicitation.destroy();
        res.status(200).json({ message: 'Tipo de solicitud eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTypeSolicitation,
    getAllTypeSolicitations,
    getTypeSolicitationById,
    updateTypeSolicitation,
    deleteTypeSolicitation
};
