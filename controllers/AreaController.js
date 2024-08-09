const Area = require('../models/Area');

const createArea = async (req, res) => {
    try {
        const area = await Area.create(req.body);
        res.status(201).json(area);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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

const updateArea = async (req, res) => {
    try {
        const area = await Area.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Area no encontrado' });
        }
        await area.update(req.body);
        res.status(200).json(area);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
