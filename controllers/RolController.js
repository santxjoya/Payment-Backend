const Rol = require('../models/Rol');

const createRol = async (req, res) => {
    try {
        const rol = await Rol.create(req.body);
        res.status(201).json(rol);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
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

const updateRol = async (req, res) => {
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
};

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
