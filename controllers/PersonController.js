const Person = require('../models/Person');
const { body, validationResult } = require('express-validator');

const createPerson = [
    body('per_name').trim().notEmpty().withMessage('El nombre es requerido.')
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    body('per_lastname').trim().notEmpty().withMessage('El apellido es requerido.')
        .isLength({ min: 2, max: 255 }).withMessage('El apellido debe tener entre 2 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    body('per_mail').trim().notEmpty().withMessage('El correo electrónico es requerido.')
        .isEmail().withMessage('El correo electrónico no es válido.').normalizeEmail(),
    body('per_password').trim().notEmpty().withMessage('La contraseña es requerida.'),
    body('rol_id').trim().notEmpty().withMessage('El rol es requerida.'),

async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const allErrors = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: allErrors });
    }
    try {
        const person = await Person.create(req.body);
        res.status(201).json(person);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];

const getAllPersons = async (req, res) => {
    try {
        const persons = await Person.findAll();
        res.status(200).json(persons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPersonById = async (req, res) => {
    try {
        const person = await Person.findByPk(req.params.id);
        if (!person) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePerson = [
    body('per_name').trim().optional()
        .isLength({ min: 4, max: 255 }).withMessage('El nombre debe tener entre 4 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras en mayúsculas.'),
    body('per_lastname').trim().optional()
        .isLength({ min: 2, max: 255 }).withMessage('El apellido debe tener entre 2 y 255 caracteres.')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/).withMessage('El apellido solo puede contener letras en mayúsculas.'),
    body('per_mail').trim().optional()
        .isEmail().withMessage('El correo electrónico no es válido.')
        .normalizeEmail(),
    body('per_password').trim().optional()
        .notEmpty().withMessage('La contraseña es requerida.'),
    body('rol_id').trim().optional()
        .notEmpty().withMessage('El rol es requerido.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const allErrors = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: allErrors });
        }
    try {
        const person = await Person.findByPk(req.params.id);
        if (!person) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        await person.update(req.body);
        res.status(200).json(person);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];

const deletePerson = async (req, res) => {
    try {
        const person = await Person.findByPk(req.params.id);
        if (!person) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        await person.destroy();
        res.status(200).json({ message: 'Persona eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPerson,
    getAllPersons,
    getPersonById,
    updatePerson,
    deletePerson
};
