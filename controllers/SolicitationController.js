const Solicitation = require('../models/Solicitation');
const { body, validationResult } = require('express-validator');

const createSolicitation = [ 
    body('sol_status').trim().notEmpty()
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    body('sol_cost').trim().notEmpty()
        .isLength({ min: 2, max: 255 }).withMessage('El apellido debe tener entre 2 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El apellido solo puede contener letras en mayúsculas.'),
    body('sol_description').trim().notEmpty()
        .isEmail().withMessage('El correo electrónico no es válido.')
        .normalizeEmail(),
    body('per_id').trim().notEmpty()
        .notEmpty().withMessage('La persona es requerido.'),
    body('sup_id').trim().notEmpty()
        .notEmpty().withMessage('El proveedor es requerido.'),
    body('cur_id').trim().notEmpty()
        .notEmpty().withMessage('Tipo de monedas es requerido.'),
    body('typ_sol_id').trim().notEmpty()
        .notEmpty().withMessage('El tipo de solicitud es requerido.'),

    async (req, res) => {
    try {
        const solicitation = await Solicitation.create(req.body);
        res.status(201).json(solicitation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];

const getAllSolicitations = async (req, res) => {
    try {
        const solicitation = await Solicitation.findAll();
        res.status(200).json(solicitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSolicitationById = async (req, res) => {
    try {
        const solicitation = await Solicitation.findByPk(req.params.id);
        if (!solicitation) {
            return res.status(404).json({ message: 'Solicitud no encontrado' });
        }
        res.status(200).json(solicitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSolicitation = [
    body('sol_status').trim().optional()
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    body('sol_cost').trim().optional()
        .isLength({ min: 2, max: 255 }).withMessage('El apellido debe tener entre 2 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El apellido solo puede contener letras en mayúsculas.'),
    body('sol_description').trim().optional()
        .isEmail().withMessage('El correo electrónico no es válido.')
        .normalizeEmail(),
    body('per_id').trim().optional()
        .notEmpty().withMessage('La persona es requerido.'),
    body('sup_id').trim().optional()
        .notEmpty().withMessage('El proveedor es requerido.'),
    body('cur_id').trim().optional()
        .notEmpty().withMessage('Tipo de monedas es requerido.'),
    body('typ_sol_id').trim().optional()
        .notEmpty().withMessage('El tipo de solicitud es requerido.'),

    async (req, res) => {
    try {
        const solicitation = await Solicitation.findByPk(req.params.id);
        if (!solicitation) {
            return res.status(404).json({ message: 'Solicitud no encontrado' });
        }
        await solicitation.update(req.body);
        res.status(200).json(solicitation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];


const deleteSolicitation = async (req, res) => {
    try {
        const solicitation = await Solicitation.findByPk(req.params.id);
        if (!solicitation) {
            return res.status(404).json({ message: 'Solicitud no encontrado' });
        }
        await solicitation.destroy();
        res.status(200).json({ message: 'Solicitud eliminado' });
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
