const New = require('../models/New');

const getAllNews = async (req, res) => {
    try {
        const news = await New.findAll();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNewById = async (req, res) => {
    try {
        const news = await New.findByPk(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllNews,
    getNewById
};