const express = require('express');
const {
    createPerson,
    getAllPersons,
    getPersonById,
    updatePerson,
    deletePerson
} = require('../controllers/PersonController');
const router = express.Router();

router.post('/persons', createPerson);
router.get('/persons', getAllPersons);
router.get('/persons/:id', getPersonById);
router.put('/persons/:id', updatePerson);
router.delete('/persons/:id', deletePerson);

module.exports = router;
