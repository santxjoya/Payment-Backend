const express = require('express')

const{
    createCurrencies,
    getCurrencies,
    getCurrenciesById,
    updateCurrencies,
    deleteCurrencies

} = require('../controllers/CurrenciesController');

const router = express.Router();

router.post('/currencies', createCurrencies);
router.get('/currencies', getCurrencies);
router.get('/currencies/:id', getCurrenciesById);
router.put('/currencies/:id', updateCurrencies);
router.delete('/currencies/:id', deleteCurrencies);
module.exports = router;
