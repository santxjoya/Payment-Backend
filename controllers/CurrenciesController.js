const Currencies = require ('../models/Currencies');

const createCurrencies = async (req ,res ) =>{
    try {
        const currency = await Currencies.create(req.body);
        res.status(201).json(currency);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getCurrencies = async (req ,res )   =>{
    try {
        const currencies = await Currencies.findAll();
        res.status(200).json(currencies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getCurrenciesById = async (req ,res )   =>{
    try {
        const currency = await Currencies.findByPk(req.params.id);
        if (!currency) {
            return res.status(404).json({ message: 'Moneda no encontrada' });
        }
        res.status(200).json(currency);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const  updateCurrencies = async (req , res )  =>  {
    try {
        const currency = await Currencies.findByPk(req.params.id);
        if (!currency) {
            return res.status(404).json({ message: 'Moneda no encontrada' });
        }
        await currency.update(req.body);
        res.status(200).json(currency);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const deleteCurrencies = async (req ,res )   =>{
    try {
        const currency = await Currencies.findByPk(req.params.id);
        if (!currency) {
            return res.status(404).json({ message: 'Moneda no encontrada' });
        }
        await currency.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    createCurrencies,
    getCurrencies,
    getCurrenciesById,
    updateCurrencies,
    deleteCurrencies
}