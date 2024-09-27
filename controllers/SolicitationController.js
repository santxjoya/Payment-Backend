const Solicitation = require('../models/Solicitation');
const Person = require('../models/Person');
const Suppliers = require('../models/Suppliers');
const Type_Solicitation = require('../models/Type_solicitation');
const Currencies = require('../models/Currencies');
const { body, validationResult } = require('express-validator');

const createSolicitation = [
    body('sol_cost')
        .trim()
        .notEmpty().withMessage('El costo no puede estar vacío.')
        .isFloat({ min: 0 }).withMessage('El costo debe ser un número válido y mayor o igual a 0.'),
    body('sol_description')
        .trim()
        .notEmpty().withMessage('La descripción es requerida.')
        .isLength({ min: 5, max: 255 }).withMessage('La descripción debe tener entre 5 y 255 caracteres.')
        .matches(/^[a-zA-ZÁÉÍÓÚÑ\s]+$/).withMessage('La descripción solo puede contener letras.'),
    body('per_id')
        .notEmpty().withMessage('La persona es requerida.'),
    body('sup_id')
        .notEmpty().withMessage('El proveedor es requerido.'),
    body('cur_id')
        .notEmpty().withMessage('El tipo de monedas es requerido.'),
    body('typ_sol_id')
        .notEmpty().withMessage('El tipo de solicitud es requerido.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const allErrors = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: allErrors });
        }
        const newSolicitationData = {
            ...req.body,
            sol_status: 1
        };

        try {
            const solicitation = await Solicitation.create(newSolicitationData);
            res.status(201).json(solicitation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

const getAllSolicitations = async (req, res) => {
    try {
        const solicitations = await Solicitation.findAll({
            include: [ 
                {
                    model: Person,
                    attributes: ['per_id', 'per_name', 'per_lastname']
                },
                {
                    model: Suppliers,
                    attributes: ['sup_id', 'sup_name']
                },
                {
                    model: Type_Solicitation, 
                    attributes: ['typ_sol_id', 'typ_sol_name']
                },
                {
                    model: Currencies, 
                    attributes: ['cur_id', 'cur_name']
                }
            ] 
        });
        res.status(200).json(solicitations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSolicitationById = async (req, res) => {
    try {
        const solicitation = await Solicitation.findByPk(req.params.id);
        if (!solicitation) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.status(200).json(solicitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSolicitation = [
    body('sol_status')
        .optional()
        .isInt({ min: 1, max: 4 }).withMessage('Debe seleccionar un estado de solicitud válido.'),
    body('sol_cost')
        .optional()
        .isFloat({ min: 0 }).withMessage('El costo debe ser un número válido y mayor o igual a 0.'),
    body('sol_description')
        .optional()
        .isLength({ min: 5, max: 255 }).withMessage('La descripción debe tener entre 5 y 255 caracteres.')
        .matches(/^[a-zA-ZÁÉÍÓÚÑ\s]+$/).withMessage('La descripción solo puede contener letras.'),
    body('per_id')
        .optional()
        .notEmpty().withMessage('La persona es requerida.'),
    body('sup_id')
        .optional()
        .notEmpty().withMessage('El proveedor es requerido.'),
    body('cur_id')
        .optional()
        .notEmpty().withMessage('El tipo de monedas es requerido.'),
    body('typ_sol_id')
        .optional()
        .notEmpty().withMessage('El tipo de solicitud es requerido.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const allErrors = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: allErrors });
        }
        try {
            const solicitation = await Solicitation.findByPk(req.params.id);
            if (!solicitation) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }
            await solicitation.update(req.body);
            res.status(200).json(solicitation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

const deleteSolicitation = async (req, res) => {
    try {
        const solicitation = await Solicitation.findByPk(req.params.id);
        if (!solicitation) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        await solicitation.destroy();
        res.status(200).json({ message: 'Solicitud eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSolicitation,
    getAllSolicitations,
    getSolicitationById,
    updateSolicitation,
    deleteSolicitation
};
