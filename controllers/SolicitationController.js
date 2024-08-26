const Solicitation = require('../models/Solicitation');

const createSolicitation = async (req, res) => {
    try {
        const solicitation = await Solicitation.create(req.body);
        res.status(201).json(solicitation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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

const updateSolicitation = async (req, res) => {
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
};


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
