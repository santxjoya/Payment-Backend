const Person = require('../models/Person');

const createPerson = async (req, res) => {
    try {
        const person = await Person.create(req.body);
        res.status(201).json(person);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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

const updatePerson = async (req, res) => {
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
};

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
