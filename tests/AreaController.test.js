const request = require('supertest');
const express = require('express');
const { createArea, getAllAreas, getAreaById, updateArea, deleteArea } = require('../controllers/AreaController');
const Area = require('../models/Area');
const app = express();

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes
app.post('/areas', createArea);
app.get('/areas', getAllAreas);
app.get('/areas/:id', getAreaById);
app.put('/areas/:id', updateArea);
app.delete('/areas/:id', deleteArea);

jest.mock('../models/Area'); // Mocks para el modelo Area

describe('Area Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('Debería crear un área correctamente', async () => {
        Area.create.mockResolvedValue({ are_id: 1, are_name: 'NUEVA AREA', are_limit: 1000 });

        const response = await request(app)
            .post('/areas')
            .send({ are_name: 'NUEVA AREA', are_limit: 1000 });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ are_id: 1, are_name: 'NUEVA AREA', are_limit: 1000 });
    });

    it('Debería retornar error si falta el nombre al crear un área', async () => {
        const response = await request(app)
            .post('/areas')
            .send({ are_limit: 1000 });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('El nombre es requerido.');
    });

    it('Debería obtener todas las áreas', async () => {
        Area.findAll.mockResolvedValue([{ are_id: 1, are_name: 'AREA 1' }, { are_id: 2, are_name: 'AREA 2' }]);

        const response = await request(app).get('/areas');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ are_id: 1, are_name: 'AREA 1' }, { are_id: 2, are_name: 'AREA 2' }]);
    });

    it('Debería obtener un área por ID', async () => {
        Area.findByPk.mockResolvedValue({ are_id: 1, are_name: 'AREA 1' });

        const response = await request(app).get('/areas/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ are_id: 1, are_name: 'AREA 1' });
    });

    it('Debería retornar 404 si el área no se encuentra', async () => {
        Area.findByPk.mockResolvedValue(null);

        const response = await request(app).get('/areas/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Area no encontrado' });
    });

    it('Debería actualizar un área', async () => {
        Area.findByPk.mockResolvedValue({
            are_id: 1,
            are_name: 'CONTADURIA',
            are_limit: 1000.00,
            update: jest.fn().mockResolvedValue({ are_id: 1, are_name: 'AREA', are_limit: 100.00}),
        });

        const response = await request(app).put('/areas/1').send({ are_name: 'CONTADURIA', are_limit: 1000.00});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ are_id: 1, are_name: 'CONTADURIA', are_limit: 1000.00})
    });

    it('Debería eliminar un área', async () => {
        Area.findByPk.mockResolvedValue({
            are_id: 1,
            destroy: jest.fn().mockResolvedValue(true),
        });

        const response = await request(app).delete('/areas/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Area eliminado' });
    });

    it('Debería retornar 404 al intentar eliminar un área que no existe', async () => {
        Area.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/areas/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Area no encontrado' });
    });
});