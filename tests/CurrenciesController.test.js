const request = require('supertest');
const express = require('express');
const { createCurrencies, getCurrencies, getCurrenciesById, updateCurrencies, deleteCurrencies } = require('../controllers/CurrenciesController');
const Currencies = require('../models/Currencies');
const app = express();

app.use(express.json());
app.post('/currencies', createCurrencies);
app.get('/currencies', getCurrencies);
app.get('/currencies/:id', getCurrenciesById);
app.put('/currencies/:id', updateCurrencies);
app.delete('/currencies/:id', deleteCurrencies);

jest.mock('../models/Currencies.js');

describe('Currencies Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('Debería crear una moneda correctamente', async () => {
        Currencies.create.mockResolvedValue({ cur_id: 1, cur_name: 'DOLAR AMERICANO' });

        const response = await request(app)
            .post('/currencies')
            .send({ cur_name: 'DOLAR AMERICANO' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ cur_id: 1, cur_name: 'DOLAR AMERICANO' });
    });

    it('Debería retornar error si falta el nombre al crear una moneda', async () => {
        const response = await request(app)
            .post('/currencies')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('El nombre es requerido.');
    });

    it('Debería obtener todas las monedas', async () => {
        Currencies.findAll.mockResolvedValue([{ cur_id: 1, cur_name: 'DOLAR' }, { cur_id: 2, cur_name: 'EURO' }]);

        const response = await request(app).get('/currencies');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ cur_id: 1, cur_name: 'DOLAR' }, { cur_id: 2, cur_name: 'EURO' }]);
    });

    it('Debería obtener una moneda por ID', async () => {
        Currencies.findByPk.mockResolvedValue({ cur_id: 1, cur_name: 'DOLAR' });

        const response = await request(app).get('/currencies/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ cur_id: 1, cur_name: 'DOLAR' });
    });

    it('Debería retornar 404 si la moneda no se encuentra', async () => {
        Currencies.findByPk.mockResolvedValue(null);

        const response = await request(app).get('/currencies/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Moneda no encontrada' });
    });

it('Debería actualizar una moneda', async () => {
    // Simulamos la moneda encontrada por findByPk
    const mockCurrency = {
        cur_id: 1,
        cur_name: 'EURO',  // Valor original
        update: jest.fn().mockResolvedValue({ cur_id: 1, cur_name: 'DOLAR' }),  // Simula el resultado después de la actualización
    };

    Currencies.findByPk = jest.fn().mockResolvedValue(mockCurrency);
    const response = await request(app).put('/currencies/1').send({ cur_name: 'DOLAR' });
    expect(mockCurrency.update).toHaveBeenCalledWith({ cur_name: 'DOLAR' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ cur_id: 1, cur_name: 'EURO' });
});


    it('Debería eliminar una moneda', async () => {
        Currencies.findByPk.mockResolvedValue({
            cur_id: 1,
            destroy: jest.fn().mockResolvedValue(true),
        });

        const response = await request(app).delete('/currencies/1');

        expect(response.status).toBe(204);
    });

    it('Debería retornar 404 al intentar eliminar una moneda que no existe', async () => {
        Currencies.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/currencies/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Moneda no encontrada' });
    });
});