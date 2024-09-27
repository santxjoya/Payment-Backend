const New = require('../models/New');
const Person = require('../models/Person');
const Solicitation = require('../models/Solicitation');

const getAllNews = async (req, res) => {
    try {
        const news = await New.findAll({
            include: [
                {
                    model: Person,
                    attributes: ['per_id', 'per_name', 'per_lastname']
                },
                {
                    model: Solicitation,
                    attributes: ['sol_id', 'sol_status', 'sol_cost', 'sol_description'],
                    include: [
                        {
                            model: Person,
                            attributes: ['per_id', 'per_name']
                        }
                    ]
                }
            ]
        });
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